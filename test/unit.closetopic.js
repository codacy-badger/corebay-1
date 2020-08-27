const assert = require('assert').strict;

const api = require('../test/api');
const { OPEN_CODE, CLOSE_CODE } = require('../lib/constants');

const errorHandler = e => {
  console.log(e.stack);
  process.exit(1);

};

const TOPIC_ID = 257766;

api.then(client => {

  client.closeTopic(TOPIC_ID).then(isOpened => {

    assert.strictEqual(isOpened, CLOSE_CODE);

    client.closeTopic(TOPIC_ID).then(isClosed => {

      assert.strictEqual(isClosed, OPEN_CODE);

    }).catch(errorHandler);

  }).catch(errorHandler);

}).catch(errorHandler);
