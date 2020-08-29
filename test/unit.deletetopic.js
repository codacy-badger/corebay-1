const assert = require('assert').strict;

const api = require('../test/api');

const TOPIC = {
  title: '323', post: '234', section: 200
};

const errorMessage = (
  'Sorry, the link that brought you ' +
  'to this page seems to be out of date or broken.'
);

const errorHandler = e => {
  console.log(e.stack);
  process.exit(1);

};

api.then(client => {

  client.createTopic(TOPIC).then(id => {

    client.deleteTopic(id).then(deleted => {

      assert.strictEqual(deleted, true);

      assert.rejects(
        client.getTopic(id),
        {
          name: 'NotExistsTopicError',
          message: errorMessage
        }
      ).catch(errorHandler);

    }).catch(errorHandler);

  }).catch(errorHandler);

}).catch(errorHandler);
