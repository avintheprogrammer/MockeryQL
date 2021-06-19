/* eslint-disable consistent-return, no-useless-escape */
import nonRemoveableContent from '../config/nonRemoveableContent.json';
import { isEmptyObject } from '../lib/object';

/**
 * Checks to see if an element has no attributes or children,
 * and makes sure it isn't one of the HTML elements that is listed as non-removeable
 * @param {Object} item
 * @returns {boolean}
 */
function isEmpty(item) {
  const { tagName, data = {}, attributes = {}, children = [] } = item;

  if (!tagName) return true;

  return (
    !nonRemoveableContent.includes(tagName)
      &&
    isEmptyObject(data)
      &&
    isEmptyObject(attributes)
      &&
    !children.length
  );
}
function removeBackQuotesFromContent(content) {
  return content.includes('\"') ? content.replace('\"', ' \"') : content;
}

export default function serialize(item = {}) {
  const { tagName, data = {}, attributes = {}, children = [], content } = item;
  const serializedItem = { tagName };

  if (content) return removeBackQuotesFromContent(content);
  if (isEmpty(item)) return;

  if (tagName === 'asset') {
    serializedItem.tagName = data.type || attributes.type;
  }

  if (!isEmptyObject(data)) serializedItem.data = data;
  if (!isEmptyObject(attributes)) serializedItem.attributes = attributes;
  if (children.length) serializedItem.children = children;

  return serializedItem;
}
