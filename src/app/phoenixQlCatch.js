import expressCatch from '../lib/express/expressCatch';
import AppConfig from '../lib/config/AppConfig';
import { isEmptyObject } from '../lib/object';

/**
 * Error handling for PhoenixQL server.
 */
const phoenixQlCatch = {
  /**
   * Logs the specified error to the specified error logger.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {Object} logger An error logger function that will be invoked to
   * log the error.
   * @param {(string|Object)} err An error that was thrown within an Express
   * middleware handler.
   * @param {Object} req The Express request.
   * @param {Object} res The Express response.
   */
  // eslint-disable-next-line no-unused-vars
  logRequestErrorToLogger(appConfig, logger, err, req, res, next)
  {
    if (logger && logger.error)
    {
      const error = expressCatch.getAppRequestError(appConfig, err, req);

      /* Make the error log a little easier to read in development. */
      const spacing = (AppConfig.HOST_TIER.dev ===
        appConfig.get('host.tier', AppConfig.HOST_TIER.dev)) ? 2 : undefined;

      logger.error(JSON.stringify(error.getAsObject(), null, spacing));
    }
  },

  /**
   * Logs the specified error to the HTTP response.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {(string|Object)} err An error that was thrown within an Express
   * middleware handler.
   * @param {Object} req The Express request.
   * @param {Object} res The Express response.
   */
  logRequestErrorToResponse(appConfig, err, req, res)
  {
    if (!res.headersSent)
    {
      const isPreRelease = appConfig.get('host.isPreRelease');

      const errorMessage = isPreRelease
        ? expressCatch.getAppRequestError(appConfig, err, req).getAsObject()
        : expressCatch.getRequestCustomerErrorMessageForResponse(
          appConfig, req, err);

      // eslint-disable-next-line no-nested-ternary
      const contentType = isPreRelease || req.url.match(/^\/graphql([/?]|$)/)
        ? 'application/json' : 'application/html';

      let contents = errorMessage;
      let status = 500;

      switch (contentType)
      {
      case 'application/json':
        contents = { error: errorMessage };
        status = 200;
        break;

      case 'application/html':
        contents = [
          '<!DOCTYPE html>',
          '<html><head>',
          '<title>Error</title></head>',
          '<body>', errorMessage, '</body>', '</html>' ].join('\n');
        break;

      default:
      }

      res.status(status).set('Content-Type', contentType).send(contents);
    }
  },

  /**
   * Returns a GraphQL error formatted appropriately.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {Object} req The Express request.
   * @param {Object} res The Express response.
   * @param {Object} graphQlParams GraphQL parameters.
   * @param {(string|Object)} err An error message or object.
   * @returns {object} an error message approprate.
   */
  onErrorGraphQl(err)
  {
    const customError = { ...err.originalError };
    if (!isEmptyObject(customError)) return customError;

    return {
      message: err.message,
      locations: err.locations,
      path: err.path,
    };
  },

  /**
   * Registers middleware for error handling.
   * @param {Express} app The Express application upon which the middleware
   * should be registered.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {Object} logger An optional error logger function that will be
   * invoked to log the error.
   */
  registerMiddlewareForErrors(app, appConfig, logger)
  {
    /* Register an error handler to log errors to the console. */
    app.use(
      expressCatch.onExpressRequestError.bind(null,
        expressCatch.logRequestErrorToConsole.bind(null, appConfig)));

    /* Register an error handler to log errors to the error logger. */
    if (logger && logger.error)
    {
      app.use(
        expressCatch.onExpressRequestError.bind(null,
          phoenixQlCatch.logRequestErrorToLogger.bind(
            null, appConfig, logger)));
    }

    /* Register an error handler to log errors to the client. */
    app.use(
      expressCatch.onExpressRequestError.bind(null,
        phoenixQlCatch.logRequestErrorToResponse.bind(null, appConfig)));

    /* Register a 'do nothing' error handler prevent the default Express error
     * middleware from running in non-production environments. */
    app.use(expressCatch.onErrorStopHandling);
  },
};

export default phoenixQlCatch;
