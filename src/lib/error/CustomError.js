import crypto from 'crypto';
import Moment from 'moment';
import BaseError from './BaseError';

/**
 * A <code>CustomError</code> class that includes helpful information fields,
 * such as error creation date and an MD5 hash that can be used to search
 * logs for all occurrences of an error.  Also supports custom formatting
 * logic to print informative error messages, and custom fields that can be
 * reported in the error output.
 */
class CustomError extends BaseError
{
  /**
   * @constructor
   * Create a <code>CustomError</code>.
   * @param {string|Error} err If an instance of <code>CustomError</code> or
   * <code>Error</code>, copy the instance's properties, instead of creating
   * a new stack trace.
   */
  constructor(err)
  {
    super(err);

    const { dateTimeCreated, stackEnabled, fields } = err || { };

    this.dateTimeCreated = dateTimeCreated || Date.now();
    this.useStack(stackEnabled);
    this.setFields(fields);
  }

  /**
   * Adds informational fields to the current error.
   * @param {object} fields The information fields that contain supplemental
   * information for the current error.
   */
  addFields(fields)
  {
    if (fields)
    {
      if (!this.fields) {
        this.fields = { };
      }

      Object.assign(this.fields, fields);
    }
    return this;
  }

  /**
   * Returns the formatted representation of the specified <code>Date</code>.
   * @param {object} date An optional date upon which to perform formatting.
   * Defaults to <code>Date.now()</code>.
   * @returns {string} The formatted representation of the specified
   * <code>Date</code>.
   */
  static getFormattedDateTime(date = Date.now())
  {
    return Moment(date).format();
  }

  /**
   * Returns a canonical hash digest for the specified string.
   * @param {string} string The string for which to return the canonical hash
   * digest.
   * @returns {string} The canonical hash digest for the specified string.
   */
  static getHashDigest(string)
  {
    return string
      ? crypto
        .createHash('md5')
        .update(string)
        .digest('hex')
        .substring(0, 10)
      : null;
  }

  /**
   * Returns a formatted representation of the error condition.
   * @param {boolean} showTrace An optional flag the specifies whether the
   * formatted output should contain an error stack trace.
   * @returns {Object} A formatted representation of the error condition.
   */
  format(showTrace = this.isStackEnabled())
  {
    return JSON.stringify(this.getAsObject(showTrace));
  }

  /**
   * Returns an object representation of the error condition.
   * @param {boolean} showTrace An optional flag the specifies whether the
   * formatted output should contain an error stack trace.
   * @returns {Object} An object representation of the error condition.
   */
  getAsObject(showTrace = this.isStackEnabled())
  {
    const object = { TIME: this.getFormattedDateTime() };
    const digest = [ ];

    const { message, stack, fields } = this;

    if (message)
    {
      object.ERROR = message;
      digest.push(message);
    }

    if (showTrace && stack)
    {
      const trace = String(stack).split(/\s*\n\s*/);
      object.TRACE = trace.length > 1 ? trace : stack;
      digest.push(stack);
    }

    if (fields)
    {
      Object.keys(fields).forEach(key =>
      {
        const value = fields[key];
        if (value != null)
        {
          object[key] = (
            (typeof value === 'object') && (value instanceof CustomError))
            ? value.getAsObject(showTrace)
            : value;
        }
      });
    }

    if (digest.length) {
      object.HASH = CustomError.getHashDigest(JSON.stringify(digest));
    }

    return object;
  }

  /**
   * Returns the formatted datetime at which the error was created.
   * @returns {string} The formatted datetime at which the error was created.
   */
  getFormattedDateTime()
  {
    return this.dateTimeCreated
      ? CustomError.getFormattedDateTime(this.dateTimeCreated) : null;
  }

  /**
   * Indicates whether the error's stack trace will be used while formatting
   * the error as a string.
   * @returns {boolean} True if the error's stack trace will be used while
   * formatting the error as a string.
   */
  isStackEnabled()
  {
    return this.stackEnabled != null ? this.stackEnabled : true;
  }

  /**
   * Sets the informational fields for the current error.
   * @param {object} fields The informational fields that contain supplemental
   * information for the current error.
   */
  setFields(fields)
  {
    this.fields = fields ? Object.assign({ }, fields) : null;
    return this;
  }

  /**
   * Enables or disables use of the error's stack trace while formatting the
   * error as a string.
   * @param {boolean} enabled Specifies whether the error's stack trace will be
   * enabled or disabled during formatting of the error.
   */
  useStack(enabled)
  {
    this.stackEnabled = enabled;
    return this;
  }
}

export default CustomError;
