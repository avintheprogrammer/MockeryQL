import articleTypes from '../config/articleTypes.json';

/**
 * Returns the security assets from the associations param
 * @param {Array.<Object>} args.associations
 * @returns {Object}
 */
export function resolveSecurities({ associations = [] }) {
  return associations.filter(association =>
    association.type === 'security'
    &&
    association.relation.find(({ relationType, isPromoted }) =>
      relationType === 'promo' && isPromoted === 'true'));
}

/**
 * Returns the article assets from the associations param
 * @param {Array.<Object>} args.associations
 * @returns {Object}
 */
export function resolveArticle({ associations = [] }) {
  return associations.filter(association =>
    articleTypes.includes(association.type)
    &&
    association.relation.find(({ relationType, isPromoted }) =>
      relationType === 'promo' && isPromoted === 'true'));
}
