/* Supported npm log levels, in increasing order of importance. */
const logLevels = [ 'debug', 'verbose', 'info', 'warn', 'error' ];

/* Supported log types. */
const logTypes = [ 'access', ...logLevels ];

function emptyLogger() { }

class Logger {
  /**
   * Configures the logger based upon the specified application configuration
   * and logger factory.
   */
  constructor()
  {
    this.configure();
  }

  /**
   * Configures the logger based upon the specified application configuration
   * and logger factory.
   */
  configure()
  {
    logTypes.forEach(logType =>
    {
      this[logType] = emptyLogger;
      this[`has${logType.charAt(0).toUpperCase()}${logType.slice(1)}`] =
        () => this[logType] !== emptyLogger;
    });
  }
}

const logger = new Logger();

export { logger, Logger as default };
