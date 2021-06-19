import jest from 'jest';
import dotenv from 'dotenv';

// Handles MaxListenersExceededWarning
// see: https://github.com/pinojs/pino/issues/144
process.stdout.setMaxListeners(100);

// Temporary until we setup our ENV variables infrastructure
const path = '.env.test';
require('dotenv').config({ path });

dotenv.config();
jest.run();
