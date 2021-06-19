import winston from 'winston';
import 'winston-daily-rotate-file';
import Logger from './Logger';

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

class WinstonLogger extends Logger {
  /**
   * Configures the logger based upon the specified parameters.
   * @param {Object} options The options used to instantiate the logger.
   */
  configure(options)
  {
    super.configure();

    const optionLogTypes = (options && (typeof options === 'object'))
      ? options.logTypes : null;

    const logTypes = optionLogTypes && (typeof optionLogTypes === 'object')
      ? optionLogTypes : [ ];

    if (logTypes.length)
    {
      const appNamePrefix = options.appName ? `${options.appName}-` : '';
      const dateFormat = options.dateFormat || DEFAULT_DATE_FORMAT;
      const dirName = options.dir || '.';

      const enabled = logTypes.reduce((types, value) =>
      {
        // eslint-disable-next-line no-param-reassign
        types[value] = true;
        return types;
      }, { });

      if (enabled.access)
      {
        const accessLogger = new winston.Logger({
          level: 'info',
          levels: winston.config.syslog.levels,
          transports: [
            new winston.transports.DailyRotateFile({
              dirname: dirName,
              filename: `%DATE%.${appNamePrefix}access.log`,
              datePattern: dateFormat,
              json: false }) ] });

        this.accessLogger = accessLogger;
        this.access = accessLogger.info;
      }

      if (enabled.error)
      {
        const errorLogger = new winston.Logger({
          level: 'error',
          levels: winston.config.syslog.levels,
          meta: false,
          json: true,
          transports: [
            new winston.transports.DailyRotateFile({
              dirname: dirName,
              filename: `%DATE%.${appNamePrefix}error.log`,
              datePattern: dateFormat }) ] });

        this.errorLogger = errorLogger;
        this.error = errorLogger.error;
      }

      /* NOTE: Winston log levels should map to the following npm log levels:
         Winston:       npm:
         emerg: 0    -> error: 0
         alert: 1    -> error: 0
         crit: 2     -> error: 0
         error: 3    -> error: 0
         warning: 4  -> warn: 1
         notice: 5   -> info: 2
         info: 6     -> info: 2
         info: 6     -> verbose: 3
         debug: 7    -> debug: 4
         debug: 7    -> silly: 5 (NOTE: We're ignoring 'silly')
      */

      const nonErrorEnabled = [ ];

      /* The following log level array needs to be in increasing importance. */
      [ 'debug', 'verbose', 'info', 'warn' ].forEach(level =>
      {
        if (enabled[level])
        {
          nonErrorEnabled.push(level);
        }
      });

      if (nonErrorEnabled.length)
      {
        const logger = new winston.Logger({
          transports: [
            new winston.transports.Console(),
            new winston.transports.DailyRotateFile({
              dirname: dirName,
              filename: `%DATE%.${appNamePrefix}debug.log`,
              datePattern: dateFormat }) ] });

        nonErrorEnabled.forEach(level =>
        {
          this[`${level}Logger`] = logger;
          this[level] = logger[level];
        });
      }
    }
  }
}

export default WinstonLogger;
