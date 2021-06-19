/* eslint-disable import/prefer-default-export, consistent-return */
import { unescape, isString } from 'lodash';
import himalaya from 'himalaya';
import moment from 'moment-timezone';
import Serializers from '../serializers';
import whiteListedAssets from '../config/whiteListedAssets.json';
import specialPatterns from '../config/specialPatterns.json';

const specialPatternList = Object.keys(specialPatterns).join('|');
const SPECIAL_PATTERN_LIST_REGEX = new RegExp(specialPatternList, 'gi'); // create regex once

/**
 * Determines if an asset is whitelisted
 * @param {Object} asset
 * @returns {boolean}
 */
function isWhiteListedAsset(asset = {}) {
  return whiteListedAssets.includes(asset.type);
}

/**
 * Determines if item is a CMS inline asset that needs to be resolved
 * @param {Object} item
 * @returns {boolean}
 */
function isInlineAsset(item = {}) {
  const { tagName } = item;
  return tagName === 'asset_inline';
}

/**
 * Finds, Filters & Serializes CAPI Assets
 * @desc Finds the respective related asset, serializes it's attributes by
 * asset type, and enforces whitelist on non inline assets
 * @param {Object} args.item
 * @param {Array.<Object>} args.associations
 * @returns {Object}
 */
function resolveAsset({ item = {}, associations = [] }) {
  const { nid, ext_link: url, autoplay_flag: autoPlay } = item.attributes;
  const relatedAsset = url // if it's an inline external link asset
    ? { url } // we already have the properties available
    : associations.find(association => nid === parseInt(association.id, 10));

  // Short circuit if CAPI doesn't provide the asset associated with the nid
  if (!relatedAsset) return;

  if (isInlineAsset(item) || relatedAsset.type === 'a') {
    return {
      ...item,
      tagName: 'a', // assumes all inline assets are supposed to be anchors
      attributes: Serializers.inlineAsset(relatedAsset),
    };
  }

  if (isWhiteListedAsset(relatedAsset)) {
    if (relatedAsset.type === 'cnbcvideo') {
      relatedAsset.autoPlay = autoPlay === 'true';
    }

    return {
      ...item,
      data: relatedAsset,
      attributes: Serializers[relatedAsset.type]
        ? Serializers[relatedAsset.type](relatedAsset)
        : relatedAsset,
    };
  }
}

/**
 * Determines if item is a CMS asset that needs to be resolved
 * @param {Object} item
 * @returns {boolean}
 */
function isAsset(item = {}) {
  const { tagName } = item;
  return ['asset', 'asset_inline'].includes(tagName);
}

/**
 * Creates a JSON structure while resolving dynamic CMS assets
 * @param {Object} args.json
 * @param {Array.<Object>} args.associations
 * @returns {Object}
 */
function resolveJSON({ json = [], associations = [] }) {
  return json.reduce((resolved, item) => {
    const { tagName, children = [] } = item;

    if (tagName === 'assets') {
      // we don't need this extra level in our structure
      const assets = resolveJSON({ json: children, associations });
      return resolved.concat(assets);
    }

    if (children.length) {
      item.children = resolveJSON({ json: children, associations }); // eslint-disable-line
    }

    if (isAsset(item)) {
      item = resolveAsset({ item, associations }); // eslint-disable-line
    }

    let serializedItem = Serializers.content(item);

    if (serializedItem && isString(serializedItem)) {
      serializedItem = unescape(serializedItem);
    }

    if (serializedItem) resolved.push(serializedItem);

    return resolved;
  }, []);
}

/**
 * Returns a string, replacing with values fropm an object passed into it
 * @param {string} text
 * @returns {string}
 */
function replaceSpecialPatterns(text) {
  return text.replace(SPECIAL_PATTERN_LIST_REGEX, (matched) => specialPatterns[matched]);
}

/**
 * Returns a string, stripped of text containing <!.../> and \n
 * @param {string} text
 * @returns {string}
 */
function sanitize(text = '') {
  const CDATA_REGEX = /<!\[CDATA\[|\]\]>/g;
  const NEWLINE_REGEX = /\n/g;
  return replaceSpecialPatterns(text).replace(CDATA_REGEX, '').replace(NEWLINE_REGEX, '');
}

/**
 * Returns the xml param formatted as JSON with the assets resolved
 * from the associations param
 * @param {string} args.xml
 * @param {Array.<Object>} args.associations
 * @returns {Object}
 */
export function resolveContent({ xml = '', associations = [] }) {
  const sanitizedXML = sanitize(xml);
  const json = himalaya.parse(sanitizedXML);
  const contentJSON = (json[0] || {}).children;

  return resolveJSON({ json: contentJSON, associations });
}

function isRelatedRelation(relation = {}) {
  const { relationType } = relation;
  return relationType === 'related';
}

function isRelatedAssociation(association = {}) {
  const { relation: relations = [] } = association;
  return relations.find(isRelatedRelation);
}

export function resolveRelated({ associations = [] }) {
  return associations.filter(isRelatedAssociation);
}

export function isPremium({ settings = {} }) {
  const { premium } = settings;
  return premium === 'Yes';
}

export function isNative({ settings = {} }) {
  const { native } = settings;
  return native === 'Yes';
}

/**
 * Returns a boolean indicating whether the relationType is of 'tags'
 * @param {Object} args.relationType
 * @returns {boolean}
 */
function isTagsRelation(relation = {}) {
  const { relationType } = relation;
  return relationType === 'tags';
}

/**
 * Returns a boolean indicating whether the relationType is of 'more'
 * @param {Object} args.relationType
 * @returns {boolean}
 */
function isMoreRelation(relation = {}) {
  const { relationType } = relation;
  return relationType === 'more';
}

/**
 * Returns a boolean indication whether 'tagName' & 'url' are present
 * @param {Object} args.title
 * @param {Object} args.url
 * @returns {Object}
 */
function containsTagName({ tagName }) {
  return tagName;
}

/**
 * Returns an object of relationType 'tags'
 * @param {Object} args.relation
 * @returns {Object}
 */
function isRelatedTagAssociation(association = {}) {
  const { relation: relations = [] } = association;
  return relations.find(isTagsRelation);
}

/**
 * Returns an object of relationType 'more'
 * @param {Object} args.relation
 * @returns {Object}
 */
function isMoreAssociation(association = {}) {
  const { relation: relations = [] } = association;
  return relations.find(isMoreRelation);
}

/**
 * Returns an array of objects with relationType 'more'
 * @param {Object} args.relation
 * @returns {Array.<Object>}
 */
export function resolveMore({ associations = [] }) {
  const moreContent = associations.filter(isMoreAssociation);
  return moreContent;
}

/**
 * Sorts the array of objects by position
 * @param {Object} a
 * @param {Object} b
 * @returns {Object}
 */
function sortRelatedPosition(a, b) {
  const { position: aRelatedTagPosition } = a.relation.find(isTagsRelation);
  const { position: bRelatedTagPosition } = b.relation.find(isTagsRelation);
  return bRelatedTagPosition - aRelatedTagPosition;
}

function isPromotedRelation(relation = {}) {
  const { isPromoted } = relation;
  return isPromoted === 'true';
}

function isPromotedAssociation(association = {}) {
  const { relation: relations = [] } = association;
  return relations.find(isPromotedRelation);
}

/**
 * Returns an array of related article tags
 * @param {Array.<Object>} args.associations
 * @returns {Array.<Object>}
 */
export function resolveRelatedTags({
  associations = [],
  promotedOnly = false,
}) {
  let relatedTagAssociations = associations
    .filter(isRelatedTagAssociation)
    .filter(containsTagName);

  if (promotedOnly) {
    relatedTagAssociations = relatedTagAssociations.filter(
      isPromotedAssociation,
    );
  }

  return relatedTagAssociations.sort(sortRelatedPosition);
}

// TODO: look to move this to a util folder in the future
function toLocalDate(date, prefix = '') {
  let formattedDate = '';
  if (date) {
    formattedDate = `${prefix} ${date
      .tz('America/New_York')
      .format('ddd, MMM D YYYY • h:mm A z')}`;
  }
  return formattedDate.trim();
}

/**
 * Returns a moment.js formatted datePublished string
 * @param {string} datePublished
 * @returns {string}
 */
export function resolveFormattedDatePublished({ datePublished }) {
  const now = moment();
  const momentDate = moment(datePublished);

  const timeFromPublishedInMinutes = now.diff(momentDate, 'minutes');
  const timeFromPublishedInHours = now.diff(momentDate, 'hours');

  const withinASixHrRange = timeFromPublishedInHours < 6;
  const justPublished = timeFromPublishedInMinutes <= 5;

  if (justPublished) return 'Published Moments Ago';
  if (withinASixHrRange) return `Published ${momentDate.fromNow().replace('minutes', 'min')}`;

  return toLocalDate(momentDate, 'Published');
}

/**
 * Returns a moment.js formatted dateLastPublished string
 * @param {string} dateFirstPublished
 * @param {string} dateLastPublished
 * @returns {string}
 */
export function resolveFormattedDateLastPublished({
  dateFirstPublished,
  dateLastPublished,
}) {
  const now = moment();
  const momentDateLastPushblished = moment(dateLastPublished);
  const momentDateFirstPublished = moment(dateFirstPublished);

  const timeFromPublishedInMinutes = now.diff(
    momentDateLastPushblished,
    'minutes',
  );
  const timeFromPublishedInHours = now.diff(momentDateLastPushblished, 'hours');

  const withinASixHrRange = timeFromPublishedInHours < 6;
  const justPublished = timeFromPublishedInMinutes <= 5;

  // If the First Pub and Last Pub dates are the same OR
  // If updates are made within 5 minutes of First Pub
  // then DON'T return a timestamp.
  const withinFiveMinutes =
    moment(momentDateLastPushblished).diff(
      momentDateFirstPublished,
      'minutes',
    ) < 5;

  if (withinFiveMinutes) return;

  if (justPublished) return 'Updated Moments Ago';
  if (withinASixHrRange) return `Updated ${momentDateLastPushblished.fromNow().replace('minutes', 'min')}`;

  return toLocalDate(momentDateLastPushblished, 'Updated');
}

/**
 * Returns a moment.js formatted dateLastPublished string
 * @param {string} dateLastPublished
 * @returns {string}
 */
export function resolveDateLastPublishedSixHr({ dateLastPublished }) {
  const momentDate = moment(dateLastPublished);
  const timeFromPublishedInHours = moment().diff(momentDate, 'hours');
  const withinUpdatedRange = timeFromPublishedInHours < 6;
  const momentFromNow = momentDate.fromNow().replace('minutes', 'min');
  if (
    momentFromNow === 'in a few seconds' ||
    momentFromNow === 'in a minute' ||
    momentFromNow === 'a few seconds ago'
  ) {
    return 'Moments Ago';
  }
  if (withinUpdatedRange) return momentFromNow;
  return '';
}
