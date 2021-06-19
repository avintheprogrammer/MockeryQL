import CustomError from './CustomError';

/**
 * An <code>AppError</code> class to represent anticipated errors that occur
 * within the application.
 */
class AppError extends CustomError
{
  /**
   * Sets the description for the current error.
   * @param {string} desc The description of the scenario that caused the
   * current error.
   */
  describe(desc)
  {
    this.addFields({ DESC: desc ? String(desc) : null });
    return this;
  }

  /**
   * Returns an object representation of the error condition.
   * @param {boolean} showTrace An optional flag the specifies whether the
   * formatted output should contain an error stack trace.
   * @returns {Object} An object representation of the error condition.
   */
  getAsObject(showTrace = this.isStackEnabled())
  {
    const object = super.getAsObject(showTrace);
    const { message, fields } = this;

    if (fields && fields.DESC)
    {
      object.ERROR = fields.DESC;
      delete object.DESC;

      if (message)
      {
        object.DETAILS = message;
      }
    }
    else if (message)
    {
      object.ERROR = message;
    }

    return object;
  }
}

export default AppError;
