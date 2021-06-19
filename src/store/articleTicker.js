/* eslint-disable import/prefer-default-export, consistent-return */
import globalAppConfig from '../app/PhoenixQlConfig';

const { ARTICLE_TICKER_DEFAULT_ID, ARTICLE_TICKER_SPECIAL_REPORTS_ID }
  = globalAppConfig.getProperties();

/**
 * returns the correct section ID; determined by an article's type
 * @param  {string} article.subtype
 * @return {Int}
 */
function getListId({ subType }) {
  if (!subType) return;

  switch (subType) {
    case 'primetime_show':
      return null;
    case 'special_report':
      return ARTICLE_TICKER_SPECIAL_REPORTS_ID;
    default:
      return ARTICLE_TICKER_DEFAULT_ID;
  }
}

async function find({ id }, options = {}, { capi, assetList }) {
  const article = await capi.find({ id });
  if (!article) return;

  const { section } = article;
  if (!section) return {};

  const listId = getListId(section);
  if (!listId) return;

  const queryString = { ...options, promoted: true };
  return assetList.find({ id: listId }, queryString);
}

export function createStore({ capi, assetList }) {
  return {
    find: (args, options) => find(args, options, { capi, assetList }),
  };
}
