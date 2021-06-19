/* eslint-disable import/prefer-default-export, consistent-return, no-param-reassign */
/* eslint-disable  no-mixed-operators */
import globalAppConfig from '../app/PhoenixQlConfig';
import { resolveRelatedArticle } from './article';

const ALPHA_NUM_REGEX = /[^a-z0-9 ]+/gi;
const SPACE_FORMAT_REGEX = /\s\s+/g;
const TAG_NAME_MAX_CHARS = 15;
const TAG_NAME_DEFAULT = 'NA';
const { EXCLUDED_BRANDS = [] } = globalAppConfig.getProperties();

/**
 * Returns a boolean indicating whether the relationType is of 'additional_sections'
 * @param {Object} args.relationType
 * @returns {boolean}
 */
function isAdditionalSectionRelation(relation = {}) {
  const { relationType } = relation;
  return relationType === 'additional_sections';
}

/**
 * Returns an object of relationType 'additional_sections'
 * @param {Object} args.relation
 * @returns {Object}
 */
function isAdditionalSectionAssociation(association = {}) {
  const { relation: relations = [] } = association;
  return relations.find(isAdditionalSectionRelation);
}

/**
 * Sorts the array of objects by position
 * @param {Object} a
 * @param {Object} b
 * @returns {Object}
 */
function sortAdditionalSectionPosition(a = {}, b = {}) {
  const { position: aAdditionalSectionPosition } = a.relation.find(isAdditionalSectionRelation);
  const { position: bAdditionalSectionPosition } = b.relation.find(isAdditionalSectionRelation);
  return aAdditionalSectionPosition - bAdditionalSectionPosition;
}

/**
 * Returns an array of Additional Section assets
 * @param {Array.<Object>} args.associations
 * @returns {Array.<Object>}
 */
export function resolveAdditionalSectionContent({ associations = [] }) {
  const additionalSectionAssociations = associations.filter(isAdditionalSectionAssociation);
  return additionalSectionAssociations.sort(sortAdditionalSectionPosition);
}

/**
 * Returns a boolean indicating whether the relationType is of 'additional_sections'
 * @param {Object} args.relationType
 * @returns {boolean}
 */
function isRelatedContentRelation(relation = {}) {
  const { relationType } = relation;
  return relationType === 'related';
}

/**
 * Returns an object of relationType 'additional_sections'
 * @param {Object} args.relation
 * @returns {Object}
 */
function isRelatedContentAssociation(association = {}) {
  const { relation: relations = [] } = association;
  return relations.find(isRelatedContentRelation);
}

/**
 * Sorts the array of objects by position
 * @param {Object} a
 * @param {Object} b
 * @returns {Object}
 */
function sortRelatedContentPosition(a = {}, b = {}) {
  const { position: aRelatedContentPosition } = a.relation.find(isRelatedContentRelation);
  const { position: bRelatedContentPosition } = b.relation.find(isRelatedContentRelation);
  return aRelatedContentPosition - bRelatedContentPosition;
}

/**
 * Returns an array of Additional Section assets
 * @param {Array.<Object>} args.associations
 * @returns {Array.<Object>}
 */
export function resolveRelatedContent({ associations = [] }) {
  const relatedContentAssociations = associations.filter(isRelatedContentAssociation);
  return relatedContentAssociations.sort(sortRelatedContentPosition);
}

/**
 * Returns a boolean indicating whether the relationType is of 'team'
 * @param {Object} args.relationType
 * @returns {boolean}
 */
function isTeamRelation(relation = {}) {
  const { relationType } = relation;
  return relationType === 'team';
}

/**
 * Returns an object of relationType 'team'
 * @param {Object} args.relation
 * @returns {Object}
 */
function isTeamAssociation(association = {}) {
  const { relation: relations = [] } = association;
  return relations.find(isTeamRelation);
}

/**
 * Sorts the array of objects by position
 * @param {Object} a
 * @param {Object} b
 * @returns {Object}
 */
function sortTeamPosition(a = {}, b = {}) {
  const { position: aTeamPosition } = a.relation.find(isTeamRelation);
  const { position: bTeamPosition } = b.relation.find(isTeamRelation);
  return aTeamPosition - bTeamPosition;
}

/**
 * Returns an array of cnbc teams
 * @param {Array.<Object>} args.associations
 * @returns {Array.<Object>}
 */
export function resolveTeam({ associations = [] }) {
  const teamAssociations = associations.filter(isTeamAssociation);
  return teamAssociations.sort(sortTeamPosition);
}

/**
 * Returns a boolean indicating whether the relationType is of 'project'
 * @param {Object} args.relationType
 * @returns {boolean}
 */
function isProjectRelation(relation = {}) {
  const { relationType } = relation;
  return relationType === 'project';
}

/**
 * Returns an object of relationType 'project'
 * @param {Object} args.relation
 * @returns {Object}
 */
function isProjectAssociation(association = {}) {
  const { relation: relations = [] } = association;
  return relations.find(isProjectRelation);
}

/**
 * Sorts the array of objects by position
 * @param {Object} a
 * @param {Object} b
 * @returns {Object}
 */
function sortProjectPosition(a = {}, b = {}) {
  const { position: aProjectPosition } = a.relation.find(isProjectRelation);
  const { position: bProjectPosition } = b.relation.find(isProjectRelation);
  return aProjectPosition - bProjectPosition;
}

/**
 * Returns an array of cnbc teams
 * @param {Array.<Object>} args.associations
 * @returns {Array.<Object>}
 */
export function resolveProject({ associations = [] }) {
  const projectAssociations = associations.filter(isProjectAssociation);
  return projectAssociations.sort(sortProjectPosition);
}

function toOptions(id, associations = [], options = {}) {
  return Object.entries(options).reduce((resolved, item) => {
    let [key, value] = item // eslint-disable-line

    if (Array.isArray(value)) value = toOptions(id, associations, value);

    if (typeof value === 'object') value = toOptions(id, associations, value);

    if (value === 'self') value = id;

    if (value === 'relatedArticle') {
      const { id: relatedArticleId } = resolveRelatedArticle({ id, associations }) || {};
      value = relatedArticleId;
    }

    if (value != null) resolved[key] = value;
    return resolved;
  }, Array.isArray(options) ? [] : {});
}

function toSource({ id, section = {} }, source) {
  if (source === 'self') return id;

  if (source === 'section') return section.id;

  return source;
}

function toModule(
  { id, section = {}, associations = [] },
  { name, source, canChangeLayout, canChangeSource, serverRenderPolicy, attributes, options },
) {
  return {
    name,
    source: toSource({ id, section }, source),
    canChangeLayout,
    canChangeSource,
    serverRenderPolicy,
    attributes,
    options: { ...toOptions(id, associations, options) },
  };
}

function toLayout({ id, section = {}, associations = [], layout = [], modulesToExclude = [] })
{
  const offsets = {};

  function resolve(rows = []) {
    return rows.reduce((resolved, item) => {
      const {
        columns = [],
        modules = [],
        name,
        source,
        options: { maintainOffset, pageSize = 20 } = {},
      } = item;

      if (columns.length) item.columns = resolve(columns);
      if (modules.length) item.modules = resolve(modules);

      if (modulesToExclude.includes(name)) return resolved;

      if (maintainOffset) {
        const itemOffset = offsets[source] || 0;
        item.options.offset = itemOffset;
        offsets[source] = itemOffset + pageSize;
      }

      resolved.push(source ? toModule({ id, section, associations }, item) : item);
      return resolved;
    }, []);
  }

  return resolve(layout);
}

function shouldDisplayTaboolaModule({ settings = {} }) {
  const { outbrainEnabled = 'Yes', native = '' } = settings;
  return (outbrainEnabled === 'Yes') && !(native === 'Yes');
}

export function resolveLayout({ id, section = {}, associations = [], layout = [], settings = {} }) {
  const modulesToExclude = [];

  if (!shouldDisplayTaboolaModule({ settings })) {
    modulesToExclude.push('taboola');
  }

  return toLayout({ id, section, associations, layout, modulesToExclude });
}

/**
 * Returns formatted tagName string
 * allow alpha numeric only and replace multiple spaces and tabs with single space
 * @param {String} args.tagName
 * @returns {String}
 */
export function resolveTagNameFormatted(tagName = '', isTruncated = false) {
  const tagNameFormatted = tagName
    .replace(ALPHA_NUM_REGEX, '')
    .replace(SPACE_FORMAT_REGEX, ' ')
    .trim()
    .toLowerCase() || TAG_NAME_DEFAULT;

  return isTruncated
    && tagNameFormatted.slice(0, TAG_NAME_MAX_CHARS)
    || tagNameFormatted;
}

/**
 * Returns an array of Section Hierarchy
 * @param {Array.<Object>} args.associations
 * @returns {Array.<Object>}
 */
export function resolveSectionHierarchy({ sectionHierarchy = [], brand, isFiltered }) {
  const sectionHierarchyArray = [...(sectionHierarchy || [])].reverse();
  if (!isFiltered || EXCLUDED_BRANDS.includes(brand)) sectionHierarchyArray.shift();

  return sectionHierarchyArray;
}
