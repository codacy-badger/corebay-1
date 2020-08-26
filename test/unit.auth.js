const assert = require('assert').strict;

const config = require('../test/files/config');
const Client = require('../lib/client');

assert(config);
assert(Client);

const api = (async () => {

  try {

    return await new Client(config);

  } catch (e) {

    console.log(e.stack);
    process.exit(1);

  }

})();

module.exports = api;
