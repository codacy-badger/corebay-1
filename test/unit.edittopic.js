const assert = require('assert').strict;

const api = require('../test/api');

const TOPIC = {
  title: '323', post: '234', section: 200
};

const EDIT_TITLE = 'testttile';
const EDIT_DESC = 'testdesc';

const errorHandler = e => {
  console.log(e.stack);
  process.exit(1);

};

api.then(client => {

  client.createTopic(TOPIC).then(id => {

    client.editTopic(id, EDIT_TITLE, EDIT_DESC).then(edited => {
      assert.strictEqual(edited, true);

      client.getTopic(id).then(({ topicData }) => {

        assert.strictEqual(EDIT_TITLE, topicData.title);
        assert.strictEqual(EDIT_DESC, topicData.description);

        client.deleteTopic(id).then(deleted => {

          assert.strictEqual(deleted, true);

        }).catch(errorHandler);

      }).catch(errorHandler);

    }).catch(errorHandler);

  }).catch(errorHandler);

}).catch(errorHandler);
