import { parse, URL } from 'url';
import { logger } from '../lib/logger/Logger';

/**
 * Returns the origin (host) from the specified URL.
 * @param {boolean} defaultProtocol If the specified URL begins with double
 * slashes '//', specifies the protocol that should be used for the returned
 * host.  Common values are 'http', 'https', and ''.
 * @returns {string} The origin from the specified URL.
 */
function getHostFromUrl(url, defaultProtocol = '')
{
  const parsed = parse(url || '', false, true);
  if (parsed.host)
  {
    const parts = [ ];

    if (parsed.protocol)
    {
      parts.push(parsed.protocol);
    }
    else if (defaultProtocol)
    {
      parts.push(defaultProtocol);
      if (defaultProtocol.substr(-1) !== ':')
      {
        parts.push(':');
      }
    }

    if (parsed.slashes)
    {
      parts.push('//');
    }
    parts.push(parsed.host);
    return parts.join('');
  }
  return '';
}

/**
 * Returns the specified URL, prepending the specified default protocol if the
 * URL begins with double slashes '//'.
 * @param {boolean} defaultProtocol If the specified URL begins with double
 * slashes '//', specifies the protocol that should be used for the returned
 * host.  Common values are 'http', 'https', and ''.
 * @returns {string} The specified URL.
 */
function getUrlWithProtocol(url, defaultProtocol = '')
{
  let result = url || '';

  if (/^\/\//.test(result) && defaultProtocol)
  {
    result = (defaultProtocol.substr(-1) !== ':')
      ? `${defaultProtocol}${result}`
      : `${defaultProtocol}:${result}`;
  }

  return result;
}

/**
* Parses url and returns normalized details
* @param {Object} url
* @returns {Object}
*/
function urlDetails({ url }) {
  if (!url) return {};

  try {
    const { host, pathname, search } = new URL(url) || {};
    return { url, host, path: `${pathname}${search}` };
  } catch (error) {
    logger.error({
      msg: 'Invalid URL',
      args: url,
      err: error.message,
    });
    return {};
  }
}

export { getHostFromUrl, getUrlWithProtocol, urlDetails as default };
