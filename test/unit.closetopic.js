const assert = require('assert').strict;

const api = require('../test/unit.auth');
const { OPEN_CODE, CLOSE_CODE } = require('../lib/constants');

(async () => {

  try {

    const client = await api;

    const isClosed = await client.closeTopic(257766);
    const isOpen = await client.closeTopic(257766);

    assert.strictEqual(isClosed, OPEN_CODE);
    assert.strictEqual(isOpen, CLOSE_CODE);

  } catch (e) {

    console.log(e.stack);
    process.exit(1);

  }

})();
