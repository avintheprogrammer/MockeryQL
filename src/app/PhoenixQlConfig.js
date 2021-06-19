import AppConfig from '../lib/config/AppConfig';

const DEFAULT_PORT = 4000;

const { HOST_TIER } = AppConfig;

const propertiesMeta =
{
  BREAKING_NEWS_LIST_ID: { },
  BUFFETT_TIMELINE: { },
  CACHING_ENABLED: { },
  CACHING_PQ_ENABLED: { },
  CACHING_MEMCACHE_HOST: { },
  CACHING_MEMCACHE_PORT: { },
  CACHING_CAPI_HARD_TTL: { },
  CACHING_CAPI_SOFT_TTL: { },
  CACHING_PCM_HARD_TTL: { },
  CACHING_PCM_SOFT_TTL: { },
  CACHING_THRESHOLD: { },
  CACHING_REDIS_AUTH: { protected: true },
  CACHING_REDIS_HOST: { },
  CACHING_REDIS_PORT: { },
  CAPI_HOST: { },
  CORS_WHITELIST: { },
  DEAL_OR_NO_DEAL_WATCH_LIVE_LIST_ID: { },
  DYNAMIC_YIELD_API_KEY: { },
  DYNAMIC_YIELD_API_SECRET: { protected: true },
  EMBED_PLAYER_URL: { },
  'env.config': { },
  EXCLUDED_BRANDS: { },
  LOG_LEVEL: { },
  LOG_TYPES_ENABLED: { },
  NEWRELIC_APP_NAME: { },
  NEWRELIC_LICENSE_KEY: { protected: true },
  NODE_ENV: { },
  PARSELY_API_KEY: { },
  PARSELY_API_SECRET: { protected: true },
  PARSELY_RELATED_URL: { },
  MOST_POPULAR_START_TIME: { },
  PCM_HOST: { },
  PORT: { },
  PRO_AUTH_API: { },
  REGISTER_API: { },
  ARTICLE_TICKER_SPECIAL_REPORTS_ID: { },
  SPLUNK_SERVER: { },
  SPLUNK_TOKEN: { protected: true },
  ARTICLE_TICKER_DEFAULT_ID: { },
  VAPI_URL: { },
  URL_OVERRIDE: { },
  WATCH_LIVE_LIST_ID: { },
};

class PhoenixQlConfig extends AppConfig
{
  static HOST_TIER = HOST_TIER;

  /**
   * @constructor
   * Creates an application configuration, with values populated from the
   * specified environment variable map.
   * @param {Object} processEnv The map of environment variables, usually
   * provided from <code>process.env</code>.
   */
  constructor(processEnv)
  {
    super(processEnv, propertiesMeta);

    if (!this.get('PORT'))
    {
      this.properties.PORT = DEFAULT_PORT;
    }
  }
}

const phoenixQlConfig = new PhoenixQlConfig(process.env);

export { phoenixQlConfig as default, PhoenixQlConfig };
