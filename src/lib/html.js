/**
 * Helpers for HTML composition.
 * @constructor
 * Utility for HTML composition.
 */
const html = {
  /**
   * Encodes the specified string so that special HTML characters are escaped
   * for literal representation in HTML.
   * @param {string} htmlStr The string to be encoded for literal
   * representation in HTML.
   * @returns {string} The encoded representation of the specified string.
   */
  encode(htmlStr)
  {
    return String(htmlStr).replace(
      /&/g, '&amp;').replace(
      /</g, '&lt;').replace(
      />/g, '&gt;');
  },

  /**
   * Returns CSS styles for allowing <code>pre</code> text to wrap.
   * @returns {string} CSS styles for allowing <code>pre</code> text to wrap.
   */
  getStylesForPreWrapping()
  {
    return [
      'pre {',
      '  white-space: pre-wrap;       /* Since CSS 2.1 */',
      '  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */',
      '  white-space: -pre-wrap;      /* Opera 4-6 */',
      '  white-space: -o-pre-wrap;    /* Opera 7 */',
      '  word-wrap: break-word;       /* Internet Explorer 5.5+ */',
      '}' ].join('\n');
  },
};

export default html;
