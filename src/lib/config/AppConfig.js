/**
 * Application configuration utility.
 */

/**
 * A typedef to allow JSDoc to link to the corresponding enum.
 * @typedef {string} AppConfigHostTier
 */

/**
 * Enum for application host tiers.
 * @enum {AppConfigHostTier}
 */
const HOST_TIER = {
  dev: 'development',
  qa: 'qa',
  stage: 'staging',
  prod: 'production' };

/**
 * Returns the properties of the specified properties metadata object, with
 * values populated from the passed environment variable map.
 * @param {Object} env The map of environment variables, usually provided from
 * <code>process.env</code>.
 * @param {Object} propertiesMeta An object that describes the properties
 * contained within the environment file, and optionally, whether each
 * property is considered sensitive.
 * @returns {Object} A properties object.
 */
const getPropertiesFromEnv = (env, propertiesMeta) =>
  Object.keys(propertiesMeta).reduce((properties, propertyName) =>
  {
    // eslint-disable-next-line no-param-reassign
    properties[propertyName] = env[propertyName];
    return properties;
  }, { });

/**
 * Returns a deep copy of the specified properties metadata, if no filter
 * function is provided; otherwise, returns a filtered subset of the specified
 * properties metadata.
 * @param {Object} env The map of environment variables, usually provided from
 * <code>process.env</code>.
 * @param {Object} propertiesMeta An object that describes the properties
 * contained within the environment file, and optionally, whether each
 * property is considered sensitive.
 * @param {function} filter An optional function that is executed once per
 * property metadata, receiving the environment variable map, property name,
 * and property metadata as parameters.  Only properties whose metadata
 * returns true from the filter function will be included in the application
 * configuration.
 * @returns {Object} A properties metadata object.
 */
const getPropertiesMeta = (env, propertiesMeta, propertyFilter) =>
  Object.keys(propertiesMeta).reduce((filtered, propertyName) =>
  {
    const propertyValue = { ...propertiesMeta[propertyName] };

    if ((!propertyFilter) ||
      propertyFilter(env, propertyName, propertyValue))
    {
      // eslint-disable-next-line no-param-reassign
      filtered[propertyName] = propertyValue;
    }
    return filtered;
  }, { });

/** @constructor
 * A global app configuration utility, which provides the ability to retrieve
 * application configuration properties based upon environment properties and
 * other factors.
 */
class AppConfig
{
  static HOST_TIER = HOST_TIER;

  /* The properties object. */
  properties = { };

  /* The properties metadata object. */
  propertiesMeta = { };

  /**
   * Returns a property filter function that redacts the values of protected,
   * non-empty properties.
   * @param {boolean} excludeEmpty Indicates whether the filter function should
   * exclude properties with empty values.
   * @returns {function} A property filter function.
   */
  static createFilterToRedact = (excludeEmpty = true) =>
    (propertyName, propertyValue, propertyMeta) =>
    {
      let newValue = propertyValue == null ? '' : propertyValue;

      if (newValue === '')
      {
        return excludeEmpty
          ? null
          : { name: propertyName, value: propertyValue };
      }

      const propertyProtected =
        ((propertyMeta != null) && propertyMeta.protected);

      if (propertyProtected)
      {
        newValue = (typeof propertyProtected === 'function')
          ? propertyProtected(newValue) : '[NOT SHOWN]';
      }

      return { name: propertyName, value: newValue };
    };

  /**
   * A property filter function that returns only properties that are
   * designated to be received by the client, with values processed via
   * <code>JSON.stringify</code>.
   * @returns {Object} The specified property, with its value processed via
   * <code>JSON.stringify</code>, if the property is designated to be received
   * by the client; otherwise, null.
   */
  static filterForClientProperties =
    (propertyName, propertyValue, propertyMeta) =>
    {
      if ((propertyMeta != null) && ('client' in propertyMeta) &&
        Boolean(propertyMeta.client))
      {
        const newValue = propertyValue == null ? '' : propertyValue;
        return { name: propertyName, value: JSON.stringify(newValue) };
      }
      return null;
    };

  /**
   * @constructor
   * Creates an application configuration, with values populated from the
   * specified environment variable map.
   * @param {Object} processEnv The map of environment variables, usually
   * provided from <code>process.env</code>.
   * @param {Object} propertiesMeta An object that describes the properties
   * contained within the environment file, and optionally, whether each
   * property is considered sensitive.
   */
  constructor(processEnv, propertiesMeta)
  {
    const env = processEnv || { };

    this.propertiesMeta = getPropertiesMeta(env, propertiesMeta);
    this.properties = getPropertiesFromEnv(env, this.propertiesMeta);

    const tier = (nodeEnv =>
    {
      if (/^prod/i.test(nodeEnv)) { return HOST_TIER.prod; }
      if (/^sta?g/i.test(nodeEnv)) { return HOST_TIER.stage; }
      if (/^adops/i.test(nodeEnv)) { return HOST_TIER.stage; }
      if (/^qa/i.test(nodeEnv)) { return HOST_TIER.qa; }
      return HOST_TIER.dev;
    }
    )(env.HOST_TIER || env.NODE_ENV);

    this.properties['host.tier'] = tier;
    this.properties['host.isSplunkEnv'] =
      Boolean(this.get('SPLUNK_TOKEN')) && Boolean(this.get('SPLUNK_HOST'));
    this.properties['host.isPreRelease'] = (tier !== AppConfig.HOST_TIER.prod);
  }

  /**
   * Returns a property from the configuration, if the specified property name
   * exists; otherwise, returns a default value.
   * @param {string} propertyName The name of the configuration property to
   * return.
   * @param {Object} defaultValue The default value to return, if the property
   * is not found.
   * @returns {Object} The configuration property, or default value if the
   * specified property is not found.
   */
  get(propertyName, defaultValue = null)
  {
    const propertyValue = propertyName in this.properties
      ? this.properties[propertyName] : null;

    return propertyValue != null ? propertyValue : defaultValue;
  }

  /**
   * Returns the properties of the specified configuration, for destructured
   * assignments.
   * @param {function} filter An optional function that filters and transforms
   * values before returning them.
   * @returns {Object} The current configuration properties.
   */
  getProperties(filter)
  {
    if (!filter)
    {
      return Object.assign({ }, this.properties);
    }

    const { properties, propertiesMeta } = this;

    return Object.keys(properties).reduce((filtered, propertyName) =>
    {
      const property = filter(
        propertyName, properties[propertyName], propertiesMeta[propertyName]);

        if (property)
        {
          // eslint-disable-next-line no-param-reassign
          filtered[property.name] = property.value;
        }

        return filtered;
      }, { });
  }
}

export default AppConfig;
