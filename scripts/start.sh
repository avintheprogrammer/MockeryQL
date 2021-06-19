#!/bin/bash
/etc/init.d/splunk start
APP_DIR=dist PORT=3000 node ./server.js
