import {
  createSplunkLogger,
  createPinoLogger,
  createSplunkPayload,
  handleSplunkError,
  handleSplunkSuccess,
  processSplunkResponse,
  createEnvironmentLogger,
  callLogger,
  createEventDate,
} from '../src/lib/logger';

describe('Logger library', () => {
  test('createSplunkLogger returns a Splunk Logger with the configured options.', () => {
    const port = 8088;
    const host = `splunk.host.com:${port}`;
    const protocol = 'https';
    const name = 'foo';
    const level = 'info';
    const splunkOptions = {
      token: 'fake-token',
      url: `${protocol}:${host}`,
      strictSSL: false,
      level,
      name,
    };
    const splunkLogger = createSplunkLogger(splunkOptions);
    expect(splunkLogger.config.host).toBe(host);
    expect(splunkLogger.config.protocol).toBe(protocol);
    expect(splunkLogger.config.port).toBe(port);
    expect(splunkLogger.config.name).toBe(name);
    expect(splunkLogger.config.level).toBe(level);
    expect(splunkLogger.config.token).toBe(splunkOptions.token);
    expect(splunkLogger.requestOptions.strictSSL).toBe(splunkOptions.strictSSL);
  });
  test('createSplunkPayload returns an object with the desired message.', () => {
    const eventDate = new Date().toISOString();
    const logLevel = 'ERROR';
    const message = 'log message';
    const eventData = {
      foo: 'bar',
    };
    const splunkPayload = createSplunkPayload(eventDate, logLevel, message, eventData);
    const expected = {
      message: `[${eventDate}] ${logLevel} ${message} ${JSON.stringify(eventData)}`,
    };
    expect(splunkPayload.message).toBe(expected.message);
  });
  test('handleSplunkError logs the splunk transport error.', () => {
    const error = {
      foo: 'bar',
    };
    const response = {
      baz: 'bat',
    };
    const statusMessage = 'Sending to Splunk failed';
    const logger = {
      error: (message) => {
        expect(message).toEqual(statusMessage);
      },
    };
    handleSplunkError(statusMessage, logger, error, response);
  });
  test('handleSplunkSuccess logs the splunk transport success status.', () => {
    const body = 'foo';
    const response = 'bar';
    const statusMessage = 'Status';
    const logger = {
      info: (message) => {
        expect(message).toBe(statusMessage);
      },
    };
    handleSplunkSuccess(statusMessage, logger, body, response);
  });
  test('processSplunkResponse handles errors.', () => {
    const successStatusMessage = 'success';
    const errorStatusMessage = 'error';
    const error = 'foo';
    const body = null;
    const response = 'foo';
    const logger = {
      error: (message) => {
        expect(message).toBe(errorStatusMessage);
      },
    };
    processSplunkResponse(
      successStatusMessage,
      errorStatusMessage,
      logger,
      error,
      response,
      body,
    );
  });
  test('processSplunkResponse handles success without errors.', () => {
    const successStatusMessage = 'success';
    const errorStatusMessage = 'error';
    const error = null;
    const body = 'foo';
    const response = 'foo';
    const logger = {
      info: (message) => {
        expect(message).toBe(successStatusMessage);
      },
    };
    processSplunkResponse(
      successStatusMessage,
      errorStatusMessage,
      logger,
      error,
      response,
      body,
    );
  });
  test('createEnvironmentLogger does not wrap splunk transport for test environment.', () => {
    const environment = 'test';
    const excludedEnvironments = ['test', 'development'];
    const logger = createPinoLogger('PhoenixQL');
    const environmentLogger = createEnvironmentLogger(
      environment,
      excludedEnvironments,
      logger,
      () => {
        throw new Error('This must not happen!');
      },
    );
    // createEnvironmentLogger must in this case return the logger untouched.
    expect(environmentLogger).toBe(logger);
  });
  test('callLogger invokes the indicated log level function with provided message, and data.', () => {
    const level = 'info';
    const message = 'hello';
    const data = {
      foo: 'bar',
    };
    const logger = {
      info: (logMessage) => {
        expect(logMessage).toEqual(message);
      },
    };
    callLogger(logger, level, message, data);
  });
  test('callLogger logs an error in case of logging errpor.', () => {
    const level = 'invalid level';
    const logger = {
      info: () => null,
      error: (message) => {
        expect(message).toEqual('An error occurred logging to the console.');
      },
    };
    callLogger(logger, level);
  });
  test('createEventDate returns an instance of Date.', () => {
    expect(createEventDate()).toBeInstanceOf(Date);
  });
});
