/* eslint-disable import/prefer-default-export */
import NetworkRequest from '../lib/networkRequest';
import Logger from '../lib/logger';
import { isEmptyObject } from '../lib/object';
import { resolveSectionHierarchy } from '../helpers/page';
import { generateURL } from '../helpers/mostPopular';
import { isPremium } from '../helpers/asset';
import globalAppConfig from '../app/PhoenixQlConfig';

const { MOST_POPULAR_START_TIME = '550h' } = globalAppConfig.getProperties();

/**
 * Figures out the section having subtype 'special_report'
 * @param {object} associations
 */
function specialReport(associations = []) {
  return associations.filter(association => (
      association &&
      Array.isArray(association.relation) &&
      association.relation.length > 0 &&
      association.relation[0].relationType === 'section' &&
      (association.subType === 'special_report')
  ));
}

async function find(args = {}, options = {}, { capi, networkClient }) {
  try {
    const apiArguments = {
      ...args,
      startPeriod: args.startPeriod || options.startPeriod || MOST_POPULAR_START_TIME,
      count: args.count || options.count || 5,
    };

    const article = apiArguments.id
      ? await capi.find({ id: apiArguments.id }) || {}
      : {};

    if (!isEmptyObject(article)) {
      if (article.branding) {
        apiArguments.tag = article.branding === 'makeit' ? 'Make It' : 'Articles';
      }

      if (isPremium({ settings: article.settings })) {
        const sectionHierarchy =
          resolveSectionHierarchy({ sectionHierarchy: article.sectionHierarchy });
        if (sectionHierarchy.length) apiArguments.tag = 'Premium';
      } else {
        const specialReports = specialReport(article.association);
        if (specialReports.length) {
          apiArguments.tag = specialReports[0].tagName;
          apiArguments.startPeriod = '24h';
        }
      }
    }

    const url = generateURL(apiArguments);
    const response = await networkClient.load({ url }) || {};
    const nodeIds = (Array.isArray(response.data))
      ? response.data.map(({ metadata }) => JSON.parse(metadata).nodeid)
      : [];

    if (!nodeIds.length) return { ...article, assets: [] };

    const assets = await capi.find({ id: nodeIds.join(',') }) || [];
    return { ...article, assets: Array.isArray(assets) ? assets : [assets] };
  } catch (error) {
    Logger.error('Failed to fetch most popular data.', {
      args: { args },
      error: error.message,
    });
    return {};
  }
}

export function createStore({ capi }) {
  const networkClient = new NetworkRequest();
  return {
    find: (args, options) => find(args, options, { capi, networkClient }),
  };
}
