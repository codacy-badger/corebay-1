const assert = require('assert').strict;

const api = require('../test/api');

const errorMessage = (
  'We could not find a topic in the database that ' +
  'matches the URL you entered, please try again and ' +
  'double check the information entered'
);

const TOPIC = {
  title: '323', post: '234', section: 200
};

const TOPIC_ID = 175671;
const NOT_EXIST_TOPIC = 99999999;

const errorHandler = e => {
  console.log(e.stack);
  process.exit(1);

};

api.then(client => {

  Promise.all([
    client.createTopic(TOPIC),
    client.createTopic(TOPIC)
  ]).then(([to, from]) => {

    client.mergeTopic(to, from).then(merged => {

      assert.strictEqual(merged, true);

      client.deleteTopic(to).then(deleted => {

        assert.strictEqual(deleted, true);

      }).catch(errorHandler);

    }).catch(errorHandler);

  }).catch(errorHandler);

  assert.rejects(
    client.mergeTopic(TOPIC_ID, NOT_EXIST_TOPIC),
    {
      name: 'Error',
      message: errorMessage
    }
  ).catch(errorHandler);

}).catch(errorHandler);
