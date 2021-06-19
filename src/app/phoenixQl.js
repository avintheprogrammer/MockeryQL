import 'babel-polyfill';
import path from 'path';
import cors from 'cors';
import Express from 'express';
import compression from 'compression';
import { RedisCache } from 'apollo-server-cache-redis';
import { ApolloServer } from 'apollo-server-express';
import NoIntrospection from 'graphql-disable-introspection';

import schema from '../schema';
import AppError from '../lib/error/AppError';
import globalAppConfig from './PhoenixQlConfig';
import logger from './PhoenixQlLogger';
import expressCatch from '../lib/express/expressCatch';
import phoenixQlCatch from './phoenixQlCatch';
import expressStatus from '../lib/express/expressStatus';
import phoenixQlStatus from './phoenixQlStatus';
import createStores from '../store';
import Serialize from '../serializers/response';

const {
  CACHING_PQ_ENABLED,
  CACHING_REDIS_AUTH,
  CACHING_REDIS_HOST,
  CACHING_REDIS_PORT,
} = globalAppConfig.getProperties();

/**
 * Returns Express middleware to handle CORS requests.
 * @param {Object} appConfig An object containing application configuration
 * parameters.
 * @returns {function} Express middleware to handle CORS requests.
 */
function createMiddlewareForCors(appConfig)
{
  const corsWhitelist = JSON.parse(appConfig.get('CORS_WHITELIST') || '[ ]');

  return cors({
    origin: corsWhitelist.map(host => new RegExp(`^(https|http)://${host}$`)),
    methods: ['GET', 'POST', 'HEAD'],
  });
}

/**
 * Returns Express middleware to handle static routes.
 * @returns {function} Express middleware to handle static routes.
 */
function createMiddlewareForStaticRoutes()
{
  return Express.static(path.join(__dirname, '..', '..', 'static'));
}

/**
 * Registers middleware for routes that should be ignored.
 * @param {Express} app The Express application upon which routes should be
 * registered.
 */
function registerMiddlewareForIgnoredRoutes(app)
{
  // eslint-disable-next-line no-unused-vars
  const doNothingMiddleware = (req, res, next) =>
  {
    res.status(200).send('');
  };

  app.all('/favicon.ico', doNothingMiddleware);
  app.all('/robots.txt', doNothingMiddleware);
}

/**
 * Configures and starts the Express application.
 * @param {AppConfig} appConfig The application configuration.
 */
function startApp(appConfig)
{
  try {
    const app = new Express();

    /* Use compression. */
    app.use(compression());

    /* Accept requests for routes that should be ignored by the server. */
    registerMiddlewareForIgnoredRoutes(app);

    /* Affix a unique ID to each incoming Express request. */
    expressStatus.registerMiddlewareForRequestId(app, appConfig);

    /* Log incoming requests to the access log. */
    phoenixQlStatus.registerMiddlewareForAccessLog(app, appConfig, logger);

    /* Accept requests for application healthcheck routes. */
    phoenixQlStatus.registerMiddlewareForHealthCheck(app, appConfig);
    expressStatus.registerMiddlewareForHealthCheck(app, appConfig);

    /* Enable system troubleshooting URLs on non-production systems. */
    if (appConfig.get('host.isPreRelease'))
    {
      phoenixQlStatus.registerMiddlewareForSystem(app, appConfig);
      expressStatus.registerMiddlewareForSystem(app, appConfig);
    }

    /* Accept requests for static content. */
    app.use(createMiddlewareForStaticRoutes());

    /* Accept CORS requests. */
    app.use(createMiddlewareForCors(appConfig));

    /* Register error handlers. */
    phoenixQlCatch.registerMiddlewareForErrors(app, appConfig, logger);

    let cache = null;

    if (CACHING_PQ_ENABLED === 'true') {
      cache = new RedisCache({
        host: CACHING_REDIS_HOST,
        port: CACHING_REDIS_PORT,
        auth_pass: CACHING_REDIS_AUTH,
        // Options are passed through to the Redis client
      });
    }

    const serverEnv = appConfig.get('NODE_ENV');
    const isProductionEnvironment =
      serverEnv === 'prod' || serverEnv === 'beta' || serverEnv === 'stg01';

    const serverOptions = {
      schema,
      persistedQueries: { cache },
      validationRules: isProductionEnvironment ? [NoIntrospection] : [],
      context: () => ({ stores: createStores() }),
      tracing: true,
      formatResponse: (response, { context }) => {
        if (!response.data) return response;

        if (!context.contentOverride || !context.contentOverride.length) return response;

        const data = Serialize(response.data, context.contentOverride);
        return { ...response, data };
      },
      formatError: err => phoenixQlCatch.onErrorGraphQl(err),
    };

    const server = new ApolloServer(serverOptions);

    server.applyMiddleware({
      app,
      gui: {
        endpoint: '/graphiql',
      },
      bodyParserConfig: { limit: '500kb' },
    });
    const port = appConfig.get('PORT');
    app.listen({ port }, () =>
      console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`),
    );

    /* Register an error handler for errors during listening. */
    app.on('error',
      expressCatch.onErrorAppListen.bind(null, appConfig, logger));
  }
  catch (err) {
    expressCatch.onErrorAppStart(appConfig, logger, new AppError(err));
  }
}

startApp(globalAppConfig);
