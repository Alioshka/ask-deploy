'use strict';

const deploy = require('./deploy');
const ASK_CMD = 'node ../node_modules/ask-cli/bin/ask.js deploy --force';
deploy.run(ASK_CMD);