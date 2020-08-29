const assert = require('assert').strict;

const api = require('../test/api');
const { PIN_CODE, UNPIN_CODE } = require('../lib/constants');

const errorHandler = e => {
  console.log(e.stack);
  process.exit(1);

};

const TOPIC_ID = 175671;

api.then(client => {

  client.pinTopic(TOPIC_ID).then(isPinned => {

    assert.strictEqual(isPinned, PIN_CODE);

    client.pinTopic(TOPIC_ID).then(isUnpinned => {

      assert.strictEqual(isUnpinned, UNPIN_CODE);

    }).catch(errorHandler);

  }).catch(errorHandler);

}).catch(errorHandler);
