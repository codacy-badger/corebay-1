const assert = require('assert').strict;

const config = require('../test/files/config');
const Client = require('../lib/client');

assert(config);
assert(Client);

module.exports = new Client(config);
