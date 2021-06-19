/**
 * Determines if relation is that of navigation
 * @param {Object} relation
 * @returns {boolean}
 */
function isNavigationItem(relation = {}) {
  const { relationType } = relation;
  return relationType === 'navigation';
}

/**
 * Determines if relation is that of sectionHeader
 * @param {Object} relation
 * @returns {boolean}
 */
function isSectionHeaderRelation(relation = {}) {
  const { relationType } = relation;
  return relationType === 'sectionHeader';
}

/**
 * Finds, and sorts navigation items by position
 * @param {Array.<Object>} associations
 * @returns {Array.<Object>}
 */
export function resolveSectionNav({ associations = [] }) {
  const navigationItems = associations.filter(association =>
    association.relation.find(isNavigationItem));

  return navigationItems.sort((a = {}, b = {}) => {
    const { position: aPosition = 0 } = a.relation.find(isNavigationItem);
    const { position: bPosition = 0 } = b.relation.find(isNavigationItem);
    return aPosition - bPosition;
  });
}

/**
 * Sorts the array of objects by position
 * @param {Object} a
 * @param {Object} b
 * @returns {Object}
 */
function sortByRelationPositionDesc(a = {}, b = {}) {
  const { position: aPosition = 0 } = a.relation;
  const { position: bPosition = 0 } = b.relation;
  return aPosition - bPosition;
}

/**
 * Determines if relation is that of sectionLogo
 * @param {Object} relation
 * @returns {boolean}
 */
function isSectionLogoRelation(relation = {}) {
  const { relationType } = relation;
  return relationType === 'sectionLogo';
}

/**
 * Returns of objects of sectionLogo relation
 * @param {Object} association
 * @returns {Object}
 */
function isSectionLogoAssociation(association = {}) {
  const { relation: relations = [] } = association;
  return relations.find(isSectionLogoRelation);
}

/**
 * Finds and sorts the associations with relationType: 'sectionLogo'
 * @param {Array.<Object>} associations
 * @returns {Array.<Object>}
 */
export function resolveSectionLogo({ associations = [] }) {
  const [sectionLogo] = associations
    .filter(isSectionLogoAssociation)
    .sort(sortByRelationPositionDesc);
  return sectionLogo;
}

/**
 * Returns of objects of sectionHeader relation
 * @param {Object} association
 * @returns {Object}
 */
function isSectionHeaderAssociation(association = {}) {
  const { relation: relations = [] } = association;
  return relations.find(isSectionHeaderRelation);
}

/**
 * Finds and sorts the associations with relationType: 'sectionHeader'
 * @param {Array.<Object>} associations
 * @returns {Array.<Object>}
 */
export function resolveHeaderImage({ associations = [] }) {
  const [sectionHeader] = associations
    .filter(isSectionHeaderAssociation)
    .sort(sortByRelationPositionDesc);
  return sectionHeader;
}

/**
 * Determines if relation is that of carousel
 * @param {Object} relation
 * @returns {boolean}
 */
function isCarouselRelation(relation = {}) {
  const { relationType } = relation;
  return relationType === 'carousel';
}

/**
 * Returns of objects of carousel relation
 * @param {Object} association
 * @returns {Object}
 */
function isCarouselAssociation(association = {}) {
  const { relation: relations = [] } = association;
  return relations.find(isCarouselRelation);
}
/**
 * Finds the association with relationType: 'carousel'
 * @param {Array.<Object>} associations
 * @returns {Array.<Object>}
 */
export function resolveCarousel({ associations = [] }) {
  return associations.filter(isCarouselAssociation);
}

/**
 * Determines if relation is that of promo
 * @param {Object} relation
 * @returns {boolean}
 */
function isPromoRelation(relation = {}) {
  const { relationType } = relation;
  return relationType === 'promo';
}

/**
 * Finds associations with relationType: 'promo'
 * @param {Array.<Object>} associations
 * @returns {Array.<Object>}
 */
export function resolvePromoBucket({ associations = [] }, { type }) {
  const promoItems = associations.filter(association =>
    Array.isArray(association.relation) && association.relation.find(isPromoRelation));
  if (type) {
    const promoItemsFilteredByType = promoItems.filter(promoItem => promoItem.type === type);
    return promoItemsFilteredByType;
  }
  return promoItems;
}

function isRelatedRelation(relation = {}) {
  return relation.relationType === 'related';
}

function isRelatedContentAssociation(association = {}) {
  const { relation: relations = [] } = association;
  return relations.find(isRelatedRelation);
}

/**
 * Returns the related content asset from the associations param
 * @param {Array.<Object>} args.associations
 * @returns {Object}
 */
export function resolveRelatedContent({ associations = [] }) {
  const relatedContentAssets = associations.filter(isRelatedContentAssociation);
  return relatedContentAssets;
}
