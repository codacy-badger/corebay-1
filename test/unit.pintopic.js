const assert = require('assert').strict;

const api = require('../test/unit.auth');
const { PIN_CODE, UNPIN_CODE } = require('../lib/constants');

(async () => {

  try {

    const client = await api;

    const isPinned = await client.pinTopic(257766);
    const isUnpinned = await client.pinTopic(257766);

    assert.strictEqual(isPinned, UNPIN_CODE);
    assert.strictEqual(isUnpinned, PIN_CODE);

  } catch (e) {

    console.log(e.stack);
    process.exit(1);

  }

})();
