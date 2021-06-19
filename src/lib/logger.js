/* eslint-disable import/no-mutable-exports */
import pino from 'pino';
import SplunkLogger from 'splunk-logging';
import globalAppConfig from '../app/PhoenixQlConfig';

/**
 * Destructure the requisite environment configuration values for splunk transport,
 * indication of which environment configuration is running, and the desired
 * loggging level.
 */
const {
  SPLUNK_SERVER,
  SPLUNK_TOKEN,
  NODE_ENV,
  LOG_LEVEL,
} = globalAppConfig.getProperties();

/**
 * List of application logging levels to wrap in Splunk transport calls.
 * @type {string[]}
 * @const
 */
export const APP_LOG_LEVELS = [
  'warn',
  'info',
  'error',
  'fatal',
  'log',
  'debug',
];

/**
 * Name of the application logger.
 * @type {string}
 * @const
 * @value 'PhoenixQL'
 */
const LOGGER_NAME = 'PhoenixQL';

/**
 * List of excluded environment names which not to use the Splunk transport.
 * @type {string[]}
 * @value ['test', 'development']
 * @const
 */
const NO_SPLUNK_TRANSPORT_ENVIRONMENTS = ['test', 'development'];

/**
 * Return a new, configured instance of Spluk Logger with configuration values
 * taken from the environment.
 * @param {splunkConfig.token} Splunk transport token for HEC.
 * @param {splunkConfig.url} Splunk transport URL for HEC.
 * @param {splunkConfig.strictSSL} Splunk strict SSL validation option.
 * @param {splunkConfig.name} Logger name.
 * @param {splunkConfig.level} Logging level.
 * @returns {SplunkLoggerInterface} A new instance of <code>SplunkLogger.Logger</code>.
 */
export function createSplunkLogger({ token, url, strictSSL, name, level }) {
  /* If any parameter has been passed in, assume the Splunk configuration is
   * valid.  Otherwise, return nothing. */
  if (!arguments.length) {
    return null;
  }

  if (!(SPLUNK_SERVER && SPLUNK_TOKEN)) {
    return null;
  }

  // Create, and return the Splunk Logger instance with the configured options.
  const splunkLogger = new SplunkLogger.Logger({
    token,
    url,
    name,
    level,
  });
  splunkLogger.requestOptions.strictSSL = strictSSL;
  return splunkLogger;
}

/**
 * Return a Pino logger object with the provided name, log level,
 * and pretty printing configuration options.
 * @param {string} name The name of the logger.
 * @param {string} level The log level; default is 'error'.
 * @param {boolean} prettyPrint Pretty-printing formatting option; default is true.
 * @returns {pino}
 */
export function createPinoLogger(name, level = 'error', prettyPrint = true) {
  return pino({
    name,
    level,
    prettyPrint,
  });
}

/**
 * Create and return a payload object for Splunk HTTP Event Collection.
 * @example <code>{message: [${DATE_TIME}] ${level} ${message}\n\n${JSON.stringify(data)}}
 * @param {string} level The logging level of the event.
 * @param {string} message The logging event message test.
 * @param {object} data The event data object.
 * @returns {Object}
 */
export function createSplunkPayload(eventDate, level, message, data) {
  const dataString = JSON.stringify(data, 2);
  return {
    message: `[${eventDate}] ${level} ${message} ${dataString}`,
  };
}


/**
 * Invoke the Pino logger function indicated by <code>level</code>
 * with the provided message, and data.
 * @param {LoggerInterface} logger A Logger interface implementation.
 * @param {string} level The logging level which will map to a logger function.
 * @param {string} message The logging event message string.
 * @param {object} data The logging event data.
 */
export function callLogger(
  logger,
  level = 'info',
  message = '',
  data = {},
) {
  try {
    // The reason for stringifying the data is otherwise objects show up
    // truncated as things that don't help such as "[Object]" instead of
    // the information in the object.  That kind of thing.
    logger[level].call(
      logger,
      message, {
        data: JSON.stringify(data),
      },
    );
  } catch (error) {
    // last ditch attempt to log something.
    logger.error('An error occurred logging to the console.', error);
  }
}

/**
 * Splunk error response handler.  If there is an error object then a
 * console log occurs at error level of the error, and the response object.
 * @param {object} logger An instance of a logger object.
 * @param {object} error The error data object.
 * @param {object} response The response object.
 */
export function handleSplunkError(statusMessage, logger, error, response) {
  if (error) {
    callLogger(logger, 'error', statusMessage, {
      error,
      response,
    });
  }
}

/**
 * Splunk successful response handler.  If there is a response body
 * then a console log at info level occurs of the body, and response occurs.
 * @param {object} body The response body.
 * @param {object} response The HTTP response object.
 */
export function handleSplunkSuccess(
  statusMessage,
  logger,
  body,
  response,
) {
  if (body) {
    callLogger(logger, 'info', statusMessage, {
      body,
      response,
    });
  }
}

/**
 * Process the response back from Splunk HTTP Event Collection.
 * @param {string} successStatusMessage Status message for logging in the event of success.
 * @param {string} errorStatusMessage Status message for logging in the event of errors.
 * @param {LoggerInterface} logger Console logging implementation.
 * @paqram {object} error An error object if any.
 * @param {object} response A response object.
 * @param {object} body A response body if any.
 * @see {handleSplunkError}
 * @see {handleSplunkSuccess}
 */
export function processSplunkResponse(
  successStatusMessage,
  errorStatusMessage,
  logger,
  error,
  response,
  body,
) {
  handleSplunkError(errorStatusMessage, logger, error, response);
  handleSplunkSuccess(successStatusMessage, logger, body, response);
}

/**
 * Send the logging event directly to Splunk using HTTP Event Collection.
 * @param {string} level The logging level.
 * @param {string} message The logging event text.
 * @param {object} data The logging event data object.
 * @see {createSplunkPayload}
 */
export function sendToSplunk(
  logger,
  splunkTransport,
  level = 'info',
  message = '',
  data = {},
) {
  try {
    const payload = createSplunkPayload(level, message, data);
    splunkTransport.send(
      payload,
      processSplunkResponse,
    );
  } catch (error) {
    // Last ditch attempt to catch something.
    callLogger(logger, 'error', 'An error occurred sending data to Splunk.', {
      error,
    });
  }
}

/**
 * Return a datetime for an event.
 * @returns {Date}
 */
export function createEventDate() {
  return new Date();
}

/**
 * Wrapper around logging functions to invoke sending the data to Splunk
 * before using Pino to log to the application console.
 * @param {string} level The logging level; default is 'info'.
 * @param {string} message The logging event message text.
 * @param {object} data The logging event data object.
 * @see {sendToSplunk}
 * @see {callPino}
 */
export function splunkWrapper(
  logger,
  splunkTransport,
  eventDateCreator = createEventDate,
  level = 'info',
  message = '',
  data = {},
) {
  if (!splunkTransport) return;
  splunkTransport.send(
    createSplunkPayload(eventDateCreator(), level, message, data),
    processSplunkResponse.bind(
      null,
      'Splunk transport success.',
      'Splunk transport error.',
      logger,
    ),
  );
  callLogger(logger, level, message, data);
}

/**
 * Return a logging interface implementation which includes a Splunk HTTP Event Collection
 * transport call as a part of the logging calls to the console.
 * @param {LoggerInterface} logger An object implementing a <code>LoggerInterface</code>.
 * @param {SplunkLogger} splunkLogger An instance of SplunkLogger.
 * @returns {SplunkLoggerInterface} A LoggerInterface decorated with Splunk HEC transportation.
 */
export function wrapLoggerInSplunkTransport(logger, splunkLogger) {
  return APP_LOG_LEVELS.map(level => ({
    [level]: splunkWrapper.bind(null, logger, splunkLogger, createEventDate, level),
  })).reduce((carry, current) => ({ ...carry, ...current }), {});
}

/**
 * Return a LoggerInterface implementation appropriate for the environment.
 * @param {string} environment The specified application environment.
 * @param {string[]} excludedEnvironments An array of environments to not wrap with a
 *   Splunk Transport.
 * @param {LoggerInterface} logger An instance of a LoggerInterface implementation.
 * @param {Function<SplunkLoggerInterface>} splunkTransportCreator A function which will return
 *  an instance of a SplunkLoggerInterface.
 * @returns {LoggerInterface}
 */
export function createEnvironmentLogger(
  environment,
  excludedEnvironments,
  logger,
  splunkTransportCreator,
) {
  return splunkTransportCreator &&
    (!excludedEnvironments.includes(environment))
    ? wrapLoggerInSplunkTransport(logger, splunkTransportCreator())
    : logger;
}

/**
 * Exported logger object.  By default this is Pino.  When running in
 * non-test, and non-local development environments this gets overridden
 * by an object which wraps logging calls to go to Splunk as well as the console.
 * @type {Object}
 */
const logger = createEnvironmentLogger(
  NODE_ENV,
  NO_SPLUNK_TRANSPORT_ENVIRONMENTS,
  createPinoLogger(LOGGER_NAME, LOG_LEVEL),
  createSplunkLogger.bind(null, {
    token: SPLUNK_TOKEN,
    url: SPLUNK_SERVER }),
);

export default logger;
