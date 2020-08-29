const assert = require('assert').strict;

const api = require('../test/api');

const TOPIC = {
  title: '323', post: '234', section: 200
};

const MIS_OR_INCORRECT_SECTION = (
  { title: '43', post: 'f', section: 435345 }
);
const MIS_TITLE = { title: '', post: 'fdsf', section: 212 };
const MIS_POST = { title: '4343', post: '', section: 212 };

const MIS_OR_INCORRECT_SECTION_MSG = (
  'This forum is read only, no new posts or replies can be made.'
);

const MIS_TITLE_MSG = (
  'You must enter a topic title longer than 2 characters'
);

const errorHandler = e => {
  console.log(e.stack);
  process.exit(1);

};

api.then(client => {

  client.createTopic(TOPIC).then(id => {

    client.getTopic(id).then(({ topicData }) => {

      assert.strictEqual(TOPIC.title, topicData.title);
      assert.strictEqual(TOPIC.post, topicData.posts[0].post);

      client.deleteTopic(id).then(deleted => {

        assert.strictEqual(deleted, true);

      }).catch(errorHandler);

    }).catch(errorHandler);

    assert.rejects(
      client.createTopic(MIS_OR_INCORRECT_SECTION),
      {
        name: 'Error',
        message: MIS_OR_INCORRECT_SECTION_MSG
      }
    ).catch(errorHandler);

    assert.rejects(
      client.createTopic(MIS_TITLE),
      {
        name: 'Error',
        message: MIS_TITLE_MSG
      }
    ).catch(errorHandler);

    assert.rejects(
      client.createTopic(MIS_POST),
      {
        name: 'Error',
        message: 'You must enter a post'
      }
    ).catch(errorHandler);

  }).catch(errorHandler);

}).catch(errorHandler);
