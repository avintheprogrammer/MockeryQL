/* eslint-disable import/prefer-default-export */

export function isEmptyObject(obj) {
  return !Object.keys(obj || {}).length;
}

/**
 * Subclasses an object.  Preferred to <code>Babel extend</code> in certain
 * circumstances, such as when extending native JavaScript classes, which
 * Babel does not handle gracefully.
 * @param {function} baseClass The base class to extend.
 * @param {function} subClass The class to be extended from the base class.
 */
export function subclass(baseClass, subClass)
{
  /* eslint-disable */
  function prototype() {}
  prototype.prototype = baseClass.prototype;
  subClass.prototype = new prototype();
  prototype.prototype = null;
  subClass.prototype.constructor = subClass;
  subClass.prototype.super = baseClass;
  /* eslint-enable */
}
