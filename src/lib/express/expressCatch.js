import CustomError from '../error/CustomError';
import AppError from '../error/AppError';
import AppRequestError from '../error/AppRequestError';

const UNREPORTED_ERROR_MESSAGE = 'An unreported error has occurred';
const TERMINATE_TIMEOUT_MS = 3000;

/**
 * Error handling for Express server.
 * Utility for handling Express server errors.
 */
const expressCatch = {
  /**
   * Returns the passed async Express middleware function wrapped by a new
   * function that includes a <code>catch</code> clause to properly invoke
   * <code>next</code> whenever uncaught exceptions are thrown within the
   * middleware, which would otherwise cause Node to generate a warning for
   * <code>UnhandledPromiseRejectionWarning</code> deprecation.  In the
   * future, unhandled promise rejections will terminate Node.
   * Big thanks to: https://strongloop.com/strongblog/
   * async-error-handling-expressjs-es7-promises-generators/
   * @param {Promise} promise The Express async middleware function to wrap.
   * @returns {function} A function that wraps the Promise with a
   * <code>catch</code> clause. */
  createAsyncMiddleware: promise =>
    (req, res, next) => promise(req, res, next).catch(next),

  /**
   * For the specified Express error and request, creates and returns an
   * appropriate <code>AppRequestError</code> object.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {(string|Object)} err An error that was thrown within an Express
   * middleware handler.
   * @param {Object} req The Express request.
   * @returns {AppRequestError} An <code>AppRequestError</code> object that is
   * appropriate for the specified Express error and request.
   */
  getAppRequestError(appConfig, err, req)
  {
    let error = null;

    if (err == null)
    {
      error = new AppRequestError(UNREPORTED_ERROR_MESSAGE)
        .request(req).useStack(false);
    }
    else if (err instanceof AppRequestError)
    {
      error = err;
    }
    else if (err instanceof CustomError)
    {
      error = new AppRequestError(err).request(req);
    }
    else if (err instanceof Error)
    {
      error = new AppRequestError(err).request(req).useStack(true);
    }
    else if (typeof err === 'string')
    {
      error = new AppRequestError(err || UNREPORTED_ERROR_MESSAGE)
        .request(req).useStack(false);
    }
    else
    {
      error = new AppRequestError(String(err) || UNREPORTED_ERROR_MESSAGE)
        .request(req).useStack(false);
    }

    return error;
  },

  /**
   * For the specified error, generates an error message to be logged to the
   * console.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {(string|Object)} err An error string or Object.
   * @returns {string} An error message to be logged to the console.
   */
  getErrorMessageForConsole(appConfig, err)
  {
    const error = err instanceof AppError
      ? err
      : new AppError(err instanceof Error ? err : String(err));

    return JSON.stringify(error.getAsObject(), null, 2);
  },

  /**
   * Returns an error message for the specified Express error and request,
   * formatted appropriately for customer viewing.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {Object} req The Express request.
   * @param {(string|Object)} err An error that was thrown within an Express
   * middleware handler.
   * @returns {string} A request error message formatted for customer viewing.
   */
  getRequestCustomerErrorMessageForResponse(appConfig, req, err)
  {
    const error = expressCatch.getAppRequestError(appConfig, err, req);

    return [
      'A technical error has occurred.  Please contact the CNBC ',
      'digital support team, and tell them that error ',
      `[${error.HASH}] occurred at `,
      `[${error.TIME}] for URL [${req.url}]` ].join('');
  },

  /**
   * For the specified Express error, generates an error message to be logged
   * to the console.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {(string|Object)} err An error that was thrown within an Express
   * middleware handler.
   * @param {Object} req The Express request.
   * @returns {string} An error message to be logged to the console.
   */
  getRequestErrorMessageForConsole(appConfig, err, req)
  {
    const error = expressCatch.getAppRequestError(appConfig, err, req);
    return JSON.stringify(error.getAsObject(), null, 2);
  },

  /**
   * Logs the specified error to the system console.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {(string|Object)} err An error that was thrown within an Express
   * middleware handler.
   * @param {Object} req The Express request.
   * @param {Object} res The Express response.
   */
  // eslint-disable-next-line no-unused-vars
  logRequestErrorToConsole(appConfig, err, req, res)
  {
    // eslint-disable-next-line no-console
    console.error(expressCatch.getRequestErrorMessageForConsole(
      appConfig, err, req));
  },

  /**
   * Generates an error message to the console.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {(string|Object)} err An error that was thrown within an Express
   * middleware handler.
   * @param {Object} logger An optional error logger function that will be
   * invoked to log the error.
   */
  onError(appConfig, err = null, logger = null)
  {
    const message = expressCatch.getErrorMessageForConsole(appConfig, err);

    // eslint-disable-next-line no-console
    console.error(message);

    if (logger && logger.error)
    {
      logger.error(message);
    }
  },

  /**
   * Generates an error message when an error occurs upon staring the HTTP
   * server listener, and terminates node.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {Object} logger An optional error logger function that will be
   * invoked to log the error.
   * @param {(string|Object)} err An error message or object.
   */
  onErrorAppListen(appConfig, logger = null, err = null)
  {
    let error = null;

    if (err == null)
    {
      error = 'Unspecified error';
    }
    else if (err.code === 'EADDRINUSE')
    {
      error = 'Port already in use';
    }
    else if (err instanceof Error)
    {
      error = err;
    }
    else {
      error = String(err);
    }

    expressCatch.onError(
      appConfig, new AppError(error || 'unspecified error')
        .describe([
          'The server reported an error while starting to listen for',
          'incoming HTTP connections on port', appConfig.get('PORT'),
          ].join(' '))
        .useStack(error instanceof Error),
      logger);

    expressCatch.waitThenTerminate(1);
  },

  /**
   * Generates an error message when an error occurs upon application start,
   * and terminates Node.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {Object} logger An optional error logger function that will be
   * invoked to log the error.
   * @param {(string|Object)} err An error message or object.
   */
  onErrorAppStart(appConfig, logger = null, err = null)
  {
    expressCatch.onError(
      appConfig, new AppError(err || 'unspecified error')
        .describe([
          'The server reported an error while starting the app on port',
          appConfig.get('PORT') ].join(' '))
        .useStack(err instanceof Error),
      logger);

    expressCatch.waitThenTerminate(1);
  },

  /**
   * When used as Express middleware, prevents the next layer of error
   * middleware from executing.
   */
  // eslint-disable-next-line no-unused-vars
  onErrorStopHandling(err, req, res, next)
  {
    /* Send a default response if no headers have yet been sent, because
       otherwise, the page will just appear to load and load and load within
       the browser. */
    if (!res.headersSent) {
      res.status(500).send(UNREPORTED_ERROR_MESSAGE);
    }
  },

  /**
   * Executes the specified error handler, catching any exceptions that occur,
   * and invoking the next Express error handler in the middleware chain.
   * @param {function} handler The error handler to execute.
   * @param {(string|Object)} err An error that was thrown within an Express
   * middleware handler.
   * @param {Object} req The Express request.
   * @param {Object} res The Express response.
   * @param {function} next The next Express middleware error handler to
   * invoke after handling this error.
   */
  onExpressRequestError(handler, err, req, res, next)
  {
    try {
      handler(err, req, res);
    }
    catch (anotherErr)
    {
      /* Disregard, but log, errors in error handler reporting, because we
       * want other error handlers in the middleware chain to also have the
       * opportunity to handle the error. */
      // eslint-disable-next-line no-console
      console.error('An error occurred during error handling:', anotherErr);
    }
    /* Assume that if an error occurs calling the next error handler, Express
     * will either handle it the proper way, or propagate it up the call
     * stack as an application error.  However, this assumption may be
     * incorrect. */
    next(err);
  },

  /**
   * Waits for a configured period of time, and then terminates the process
   * with the specified exit code.  Gives loggers and other async routines a
   * little extra time to cleanup.
   * @param {number} exitCode The exit code to report when terminating.
   */
  waitThenTerminate(exitCode = 0)
  {
    // eslint-disable-next-line no-console
    console.error('Waiting a few seconds to terminate...');
    setTimeout(() => { process.exit(exitCode); }, TERMINATE_TIMEOUT_MS);
  },
};

export default expressCatch;
