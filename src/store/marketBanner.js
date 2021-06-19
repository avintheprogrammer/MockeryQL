/* eslint-disable import/prefer-default-export, consistent-return */

/**
 * Returns a boolean indicating whether the relationType is of 'tags'
 * @param {Object} args.relationType
 * @returns {boolean}
 */
function isNavigationRelation(relation = {}) {
  const { relationType } = relation;
  return relationType === 'navigation';
}

/**
 * Sorts the array of objects by position
 * @param {Object} a
 * @param {Object} b
 * @returns {Object}
 */
function sortByRelationPosition(a = {}, b = {}) {
  const { position: aPosition = 0 } = a.relation.find(isNavigationRelation);
  const { position: bPosition = 0 } = b.relation.find(isNavigationRelation);
  return bPosition - aPosition;
}

/**
 * Fetches market banner data from CAPI
 * @param {number} args.id
 * @param {number} args.marketCount
 * @param {number} args.securityCount
 * @param {number} args.articleCount
 * @returns {object}
 */
async function find({ id }, { marketCount, securityCount, articleCount }, { capi }) {
  const marketOverviewData = await capi.find({ id });
  if (!marketOverviewData) return;

  const { association: associations } = marketOverviewData;
  const marketsPromoView = associations
    .filter(association =>
      association.relation.find(
        relation =>
          relation.relationType === 'navigation' &&
          relation.isPromoted === 'true',
      ),
    )
    .sort(sortByRelationPosition);
  // fetch the full views so we have the association data on these market items
  const marketsFullView = await Promise.all(
    marketsPromoView.map(async marketPromoView => {
      const marketFullView = await capi.find({ id: marketPromoView.id });
      return {
        ...marketFullView,
        securityCount,
        articleCount,
      };
    }),
  );

  const markets = marketCount
    ? marketsFullView.slice(0, marketCount)
    : marketsFullView;

  return {
    ...marketOverviewData,
    markets,
  };
}

export function createStore({ capi }) {
  return {
    find: (args, options) => find(args, options, { capi }),
  };
}
