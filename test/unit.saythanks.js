const assert = require('assert').strict;

const config = require('../test/files/config');
const Client = require('../lib/client');

const api = require('../test/api');

assert(config);
assert(Client);

const TOPIC = {
  title: '323', post: '[hide]test[/hide]', section: 95
};

const errorHandler = e => {
  console.log(e.stack);
  process.exit(1);

};

const clients = [api, new Client(config.user)];

Promise.all(clients).then(([one, two]) => {

  one.createTopic(TOPIC).then(topicId => {

    two.getTopic(topicId).then(({ topicData, sectionId }) => {

      const { posts } = topicData;

      const post = posts[0];

      two.sayThanks(topicId, post.id, sectionId).then(postData => {

        assert.strictEqual(postData.post, 'Hidden part: test');

        one.deleteTopic(topicId).then(deleted => {

          assert.strictEqual(deleted, true);

        }).catch(errorHandler);

      }).catch(errorHandler);

    }).catch(errorHandler);

  }).catch(errorHandler);

}).catch(errorHandler);
