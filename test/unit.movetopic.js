const assert = require('assert').strict;

const api = require('../test/api');

const errorMessage = (
  'You did not choose a destination forum'
);

const TOPIC = {
  title: '323', post: '234', section: 200
};

const NOT_EXIST_SECTION = 99999999;
const SECTION_ID = 199;
const TOPIC_ID = 175671;

const errorHandler = e => {
  console.log(e.stack);
  process.exit(1);

};

api.then(client => {

  client.createTopic(TOPIC).then(id => {

    client.moveTopic(id, SECTION_ID).then(moved => {

      assert.strictEqual(moved, true);

      client.deleteTopic(id).then(deleted => {

        assert.strictEqual(deleted, true);

      }).catch(errorHandler);

    }).catch(errorHandler);

  }).catch(errorHandler);

  assert.rejects(
    client.moveTopic(TOPIC_ID, NOT_EXIST_SECTION),
    {
      name: 'Error',
      message: errorMessage
    }
  ).catch(errorHandler);

}).catch(errorHandler);
