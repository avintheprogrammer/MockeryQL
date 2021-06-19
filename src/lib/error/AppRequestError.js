import AppError from './AppError';

/**
 * A class that represents HTTP request errors, rendered with error messages
 * that are easily findable in logs, due to a timestamp and hash fingerprint
 * that are prefixed to the error message.
 * @augments {AppError}
 */
class AppRequestError extends AppError {
  /**
   * Adds informational fields about the specified HTTP request to the
   * current error.
   * @param {object} req The request object containing informational fields
   * about the specified HTTP request to the current error.
   */
  request(req)
  {
    if (req)
    {
      const fields = { };
      fields.URL = req.url;
      fields.METHOD = `${req.method} HTTP/${req.httpVersion}`;

      const reqContentType = req.get('Content-Type');
      if (reqContentType)
      {
        fields['CONTENT TYPE'] = reqContentType;
      }
      if ('id' in req)
      {
        fields.ID = req.id;
      }
      this.addFields({ REQUEST: fields });
    }
    return this;
  }
}

export default AppRequestError;
