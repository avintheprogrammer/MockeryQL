import WinstonLogger from '../lib/logger/WinstonLogger';
import globalAppConfig from './PhoenixQlConfig';

class PhoenixQlLogger extends WinstonLogger {
  /**
   * Configures the logger based upon the specified application configuration.
   * @param {Object} appConfig An object containing application configuration
   * parameters.
   */
  constructor(appConfig)
  {
    super();

    const options = {
      appName: 'phoenixql',
      dir: 'log',
      logTypes: appConfig.get('LOG_TYPES_ENABLED', '').split(',').map(
        value => value.trim().toLowerCase()) };

    this.configure(options);
  }
}

const logger = new PhoenixQlLogger(globalAppConfig);

export { logger as default, PhoenixQlLogger };
