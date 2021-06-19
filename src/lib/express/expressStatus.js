import fs from 'fs';
import RequestId from 'express-request-id';
import request from 'request-promise';
import AppConfig from '../config/AppConfig';
import AppError from '../error/AppError';
import AppRequestError from '../error/AppRequestError';
import html from '../html';
import Cache from '../caching/Cache';
import CacheSources from '../caching/cacheSources';
import Logger from '../logger';

const BUILD_INFO_FILE = './.build-info.json';

/**
 * System troubleshooting and status for Express server.
 */
const expressStatus = {
  /**
   * Returns the build information.
   * @returns {string} The build information.
   */
  getBuildInfo(defaultFallback = null)
  {
    try {
      if (!fs.existsSync(BUILD_INFO_FILE))
      {
        return defaultFallback || 'Build information not available';
      }
    } catch (err) {
      if (defaultFallback) {
        return defaultFallback;
      }
      throw new AppError(err).describe(
        'Unable to query file system for build information').setFields({
          File: BUILD_INFO_FILE });
    }

    let buildInfoContents = null;

    try {
      buildInfoContents = fs.readFileSync(BUILD_INFO_FILE);
    } catch (err) {
      if (defaultFallback) {
        return defaultFallback;
      }
      throw new AppError(err).describe(
        'Unable to read build information from file system').setFields({
          File: BUILD_INFO_FILE });
    }

    try {
      return JSON.parse(buildInfoContents);
    } catch (err) {
      if (defaultFallback) {
        return defaultFallback;
      }
      throw new AppError(err).describe(
        'Unable to parse build information from file').setFields({
          File: BUILD_INFO_FILE });
    }
  },

  /**
   * Express middleware to respond to requests for healthcheck URLs that aren't
   * otherwise handled.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {Object} req The Express request.
   * @param {Object} res The Express response.
   */
  onRequestHealthCheckPageNotFoundRoute(appConfig, req, res)
  {
    res.status(200).send([
      '<!DOCTYPE html>',
      '<html><head>',
      '<style>', html.getStylesForPreWrapping(), '</style>',
      '<title>Health Check Page Not Found</title></head>',
      '<body><pre>',
      'Health Check page not found.',
      '</pre></body></html>' ].join('\n'));
  },

  /**
   * Express middleware to respond to requests for health check up URLs.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {Object} req The Express request.
   * @param {Object} res The Express response.
   * @param {Function} queryMiddleware An Express middleware.
   */
  async onRequestHealthCheckUpRoute(appConfig, req, res)
  {
    res.status(200).set('Content-Type', 'application/json').send(
      JSON.stringify({ status: 'success' }, null, 2));
  },

  /**
   * Express middleware to respond to requests for system URLs that aren't
   * otherwise handled.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {Object} req The Express request.
   * @param {Object} res The Express response.
   */
  onRequestSystemPageNotFoundRoute(appConfig, req, res)
  {
    res.status(200).send([
      '<!DOCTYPE html>',
      '<html><head>',
      '<style>', html.getStylesForPreWrapping(), '</style>',
      '<title>System Page Not Found</title></head>',
      '<body><pre>',
      'System page not found.',
      '</pre></body></html>' ].join('\n'));
  },

  /**
   * Express middleware to respond to requests for system status URLs.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {Object} req The Express request.
   * @param {Object} res The Express response.
   */
  onRequestSystemStatusRoute(appConfig, req, res)
  {
    const content = JSON.stringify(
    {
      appConfig: appConfig.getProperties(AppConfig.createFilterToRedact(true)),
      buildInfo: expressStatus.getBuildInfo(),
    }, null, 2);

    res.status(200).set('Content-Type', 'application/json').send(content);
  },

  /**
   * Express middleware to respond to requests for system URLs to simulate
   * HTTP status and error messages.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {Object} req The Express request.
   * @param {Object} res The Express response.
   */
  onRequestSystemThrowRoute(appConfig, req, res)
  {
    res.status(req.params.code).send([
      '<!DOCTYPE html>',
      '<html><head>',
      '<style>', html.getStylesForPreWrapping(), '</style>',
      '<title>System Status Code</title></head>',
      '<body><pre>',
      `Returning HTTP Status ${req.params.code}`,
      '</pre></body></html>' ].join('\n'));
  },

  /**
   * Returns a Promise to perform an application health check for the specified
   * service, returning an object populated with the health check status.
   * @param {string} name The name of the service to be queried.
   * @param {string} url The URL of the service to be queried.
   * @param {function} checker An optional function to execute upon the service
   * response, to verify whether the service is healthy.
   * @returns {Promise} A promise to perform an application health check.
   */
  async performHealthCheckForService(name, url, checker = null)
  {
    return request({
      uri: url,
      resolveWithFullResponse: true,
      simple: false,
    }).then(response =>
    {
      let success = /^2/.test(String(response.statusCode));

      if (success && checker)
      {
        success = checker(response);
      }

      return { name, url, success };
    })
    .catch(err => ({ name, url, success: false, error: err }));
  },

  /**
   * Performs an application health check for the specified services, returning
   * an object whose properties contain the health check status and possible
   * error for each service.
   * @param {object} services An object whose properties describe services,
   * with each property containing an object with properties 'url', and an
   * optional function 'checker' to be executed upon the service response to
   * verify the proper operation of the service.
   * @param {boolean} parallel False if all service health checks should be
   * invoked in parallel; true if each service health check should be invoked
   * only after the preceding health check completes.
   * @returns {object} An object whose properties contain the health check
   * status and possible error for each service.
   */
  async performHealthCheckForServices(services, parallel = true)
  {
    const results = { };

    if (parallel)
    {
      await Promise.all(Object.keys(services).map(async name =>
      {
        const { url, checker } = services[name];

        return expressStatus.performHealthCheckForService(name, url, checker)
          .then(result => { results[name] = result; });
      }));
    }
    else
    {
      await Object.keys(services).reduce(async (prev, name) =>
      {
        const { url, checker } = services[name];

        await prev;

        return expressStatus.performHealthCheckForService(name, url, checker)
          .then(result => { results[name] = result; });
      },
      Promise.resolve());
    }

    return results;
  },

  /**
   * Registers Express middleware for Express healthchecks.
   * @param {Object} app The Express instance.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   */
  // eslint-disable-next-line no-unused-vars
  registerMiddlewareForHealthCheck(app, appConfig)
  {
    app.get('/healthcheck/up',
      expressStatus.onRequestHealthCheckUpRoute.bind(null, appConfig));

    app.get('/healthcheck/*',
      expressStatus.onRequestHealthCheckPageNotFoundRoute.bind(
        null, appConfig));
  },

  /**
   *
   * Registers Express middleware for embedding a unique request ID within the
   * Express request.
   * @param {Object} app The Express instance.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   */
  // eslint-disable-next-line no-unused-vars
  registerMiddlewareForRequestId(app, appConfig)
  {
    app.use(new RequestId());
  },


  /**
 * flush the cache.
 * @param {object} params: params to pick the appropriate flush method.
 */
async flushCache(params = {}) {
  try {
    const memcached = Cache.getInstance(CacheSources.memcache);
    return await memcached.flushCache(params).then((data) => data).catch((error) => {
      Logger.error('Resetting cache failed.', {
        component: 'PhoenixQl',
        error: error.message,
      });
      return false;
    });
  } catch (error) {
      Logger.error('Resetting cache failed', {
        component: 'PhoenixQl',
        error: error.message,
      });
      return false;
  }
},


  /**
   * Registers Express middleware for system debugging and troubleshooting.
   * @param {Object} app The Express instance.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   */
  registerMiddlewareForSystem(app, appConfig)
  {
    app.get('/system/status',
      expressStatus.onRequestSystemStatusRoute.bind(null, appConfig));

    // cache flush endpoint
    app.get('/system/purge-cache/', async (req, res, next) => {
      try {
        const response = await expressStatus.flushCache(req.query);
        if (response) return res.status(200).send(JSON.stringify(response));
        return res.status(500).send('Something went wrong, Please try again');
      } catch (e) {
        return next(e);
      }
    });

    app.get('/system/throw/:code(\\d\\d\\d)',
      expressStatus.onRequestSystemThrowRoute.bind(null, appConfig));

    app.get('/system',
      expressStatus.onRequestSystemPageNotFoundRoute.bind(null, appConfig));

    app.get('/system/*',
      expressStatus.onRequestSystemPageNotFoundRoute.bind(null, appConfig));
  },

  /**
   * Generates a health check report based upon the specified results of the
   * service dependency health checks, and throws an error if any errors have
   * been encountered so that further Express middleware error handlers may
   * report the error.
   */
  reportHealthCheck(appConfig, req, res, serviceResults, supplementalInfo = null)
  {
    const serviceStatuses = { };
    const errorFields = { };
    let errorCount = 0;
    let isHealthy = true;

    Object.keys(serviceResults).forEach(name =>
    {
      const { url, success, error } = serviceResults[name];

      if (error)
      {
        isHealthy = false;

        let cause = error;
        if (cause != null)
        {
          if ((typeof cause === 'object') && ('message' in error))
          {
            cause = error.message;
          }
          if (typeof cause !== 'string')
          {
            cause = String(cause);
          }
        }

        const prefix = `SERVICE ${errorCount += 1}`;
        errorFields[prefix] = name;
        errorFields[`${prefix} URL`] = url;
        errorFields[`${prefix} CAUSE`] =
          (cause || 'An unreported error occurred');
      }

      if (!success)
      {
        isHealthy = false;
      }

      serviceStatuses[name] = success ? 'success' : 'failed';
    });

    const status = { status: (isHealthy ? 'success' : 'failed') };

    if (supplementalInfo)
    {
      status.info = (typeof supplementalInfo === 'object' &&
        supplementalInfo.constructor.name !== 'Array')
        ? supplementalInfo
        : JSON.stringify(supplementalInfo);
    }

    if (Object.keys(serviceStatuses).length)
    {
      status.services = { ...serviceStatuses };
    }

    res.status(isHealthy ? 200 : 500).json(status);

    /* Propagate the errors so that they can be logged by subsequent Express
     * middleware error handlers. */
    if (errorCount)
    {
      throw new AppRequestError([
          'Errors occurred while performing health checks for system',
          'dependencies' ].join(' '))
        .request(req).addFields(errorFields).useStack(false);
    }
  },
};

export default expressStatus;
