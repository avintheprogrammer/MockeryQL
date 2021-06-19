const fs = require('fs');

const { NODE_ENV } = process.env;

// Temporary until we setup our ENV variables infrastructure
const path = fs.existsSync(`.env.${NODE_ENV}`)
  ? `.env.${NODE_ENV}`
  : '.env';

require('dotenv').config({ path });
process.env['env.config']=path;
