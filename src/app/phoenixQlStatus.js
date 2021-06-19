import expressWinston from 'express-winston';
import html from '../lib/html';
import { getHostFromUrl, getUrlWithProtocol } from '../lib/urlDetails';
import expressCatch from '../lib/express/expressCatch';
import expressStatus from '../lib/express/expressStatus';

/**
 * Performs an application health check, returning an HTTP non-200 status, and
 * throwing an error, if any downstream system is not healthy.
 * @param {Object} appConfig An object containing application configuration
 * parameters.
 * @param {Object} req The Express request.
 * @param {Object} res The Express response.
 */
// eslint-disable-next-line no-unused-vars
async function performHealthCheck(appConfig, req, res)
{
  const CAPI_HOST = getUrlWithProtocol(
    appConfig.get('CAPI_HOST', ''), 'https');
  const PCM_HOST = getHostFromUrl(
    appConfig.get('PCM_HOST', ''), 'https');

  const services = {
    CAPI: { url: `${CAPI_HOST}/health` },
    PCM: { url: `${PCM_HOST}/healthcheck` } };

  const serviceResults =
    await expressStatus.performHealthCheckForServices(services);

  let buildVersion = (
    (expressStatus.getBuildInfo({}).git || {}).commit || {}).hash;
  buildVersion = buildVersion
    ? buildVersion.substr(0, 8)
    : 'Version information not available';

  const supplementalInfo = {
    config: appConfig.get('env.config'),
    env: appConfig.get('NODE_ENV'),
    tier: appConfig.get('host.tier'),
    version: buildVersion,
  };

  expressStatus.reportHealthCheck(
    appConfig, req, res, serviceResults, supplementalInfo);
}

/**
 * System troubleshooting and status for PhoenixQL server.
 */
const phoenixQlStatus = {
  /**
   * Express middleware to respond to requests for system test URLs.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {Object} req The Express request.
   * @param {Object} res The Express response.
   */
  onRequestSystemTestRoute(appConfig, req, res)
  {
    res.status(401).send([
      '<!DOCTYPE html>',
      '<html><head>',
      '<style>', html.getStylesForPreWrapping(), '</style>',
      '<title>System Tests</title></head>',
      '<body><pre>',
      'System tests not yet implemented.',
      '</pre></body></html>' ].join('\n'));
  },

  /**
   * Registers Express middleware for logging incoming requests.
   * @param {Object} app The Express instance.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   * @param {Object} logger An optional logger function that will be invoked to
   * log the incoming request.
   */
  // eslint-disable-next-line no-unused-vars
  registerMiddlewareForAccessLog(app, appConfig, logger)
  {
    if (logger && logger.accessLogger)
    {
      app.use(expressWinston.logger({
        winstonInstance: logger.accessLogger,
        meta: false,
        msg: [
          'Request', '{{req.id}}', '{{req.url}}', '{{req.method}}',
          'Response', '{{res.statusCode}}', '{{res.responseTime}}ms',
        ].join(' | '),
      }));
    }
  },

  /**
   * Registers Express middleware for PhoenixQL-specific healthchecks.
   * @param {Object} app The Express instance.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   */
  // eslint-disable-next-line no-unused-vars
  registerMiddlewareForHealthCheck(app, appConfig)
  {
    app.get('/healthcheck', expressCatch.createAsyncMiddleware(
      performHealthCheck.bind(null, appConfig)));
  },

  /**
   * Registers Express middleware for PhoenixQL-specific system debugging and
   * troubleshooting.
   * @param {Object} app The Express instance.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   */
  registerMiddlewareForSystem(app, appConfig)
  {
    app.get('/system/test',
      phoenixQlStatus.onRequestSystemTestRoute.bind(null, appConfig));
  },
};

export default phoenixQlStatus;
