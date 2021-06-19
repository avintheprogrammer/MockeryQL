/* eslint-disable import/prefer-default-export, consistent-return */
import articleTypes from '../config/articleTypes.json';

import { resolveContent } from './asset';

import { flatten } from '../lib/array';

/**
 * Returns the related content asset from the associations param
 * @param {Array.<Object>} args.associations
 * @returns {Object}
 */
export function resolveRelatedArticle({ id, associations = [] }) {
  const relatedArticles = associations.filter(association =>
    (articleTypes.includes(association.type) ||
    association.type === 'cnbcvideo' || association.type === 'wildcard') &&
    association.relation && association.relation.find(rel => (rel.relationType === 'more')));
  // find the related asset with the highest relation position
  const maxPosition = Math.max(...relatedArticles.map(o => (o.relation && o.relation[0].position)));
  return relatedArticles.find(o => o.id !== id
    && (o.relation && o.relation[0].position === maxPosition));
}

function isPremiumTag(row = {}) {
  const { tagName } = row;
  return tagName === 'promotional_cutoff';
}

function removePremiumTags(json = []) {
  return json.filter(row => !isPremiumTag(row));
}

function removeTopLevelGroupTags(json = []) {
  return flatten(json.map(content => content.children));
}

export function resolveBody({ xml = '', associations = [] }) {
  const content = resolveContent({ xml, associations });
  const premiumIndex = content.findIndex(isPremiumTag);

  const freeContent = premiumIndex !== -1
    ? removeTopLevelGroupTags(content.slice(0, premiumIndex))
    : removeTopLevelGroupTags(content);

  const premiumContent = premiumIndex !== -1
    ? removeTopLevelGroupTags(removePremiumTags(content.slice(premiumIndex)))
    : null;

  return {
    freeContent,
    premiumContent,
  };
}
