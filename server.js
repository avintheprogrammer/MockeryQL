require('./env.loader');

/* NOTE: We discourage the use of 'process.env' for any purpose within this
 * app.  However, New Relic is special.  All other uses of 'process.env' should
 * be replaced with 'globalAppConfig'. */
if (process.env.NEWRELIC_LICENSE_KEY)
{
  // eslint-disable-next-line global-require
  require('newrelic');
  require('@newrelic/apollo-server-express');
}

const SRC_DIR = `./${process.env.APP_DIR || 'src'}`;
require(`${SRC_DIR}/app/phoenixQl.js`);
