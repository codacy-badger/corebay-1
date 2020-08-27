const assert = require('assert').strict;

const api = require('../test/unit.auth');

(async () => {

  try {

    const client = await api;

    const MIS_OR_INCORRECT_SECTION = (
      { title: '43', post: 'f', section: 435345 }
    );

    const MIS_OR_INCORRECT_SECTION_MSG = (
      'This forum is read only, no new posts or replies can be made.'
    );

    const MIS_OR_INCORRECT_SECTION_PROMISE = await assert.rejects(
      async () => (await client.createTopic(MIS_OR_INCORRECT_SECTION)),
      error => {
        assert.strictEqual(error.name, 'Error');
        assert.strictEqual(error.message, MIS_OR_INCORRECT_SECTION_MSG);
        return true;
      }
    );

    const MIS_TITLE = { title: '', post: 'fdsf', section: 212 };

    const MIS_TITLE_MSG = (
      'You must enter a topic title longer than 2 characters'
    );

    const MIS_TITLE_PROMISE = await assert.rejects(
      async () => (await client.createTopic(MIS_TITLE)),
      error => {
        assert.strictEqual(error.name, 'Error');
        assert.strictEqual(error.message, MIS_TITLE_MSG);
        return true;
      }
    );

    const MIS_POST = { title: '4343', post: '', section: 212 };

    const MIS_POST_PROMISE = await assert.rejects(
      async () => (await client.createTopic(MIS_POST)),
      error => {
        assert.strictEqual(error.name, 'Error');
        assert.strictEqual(error.message, 'You must enter a post');
        return true;
      }
    );

    const errorMessage = (
      'Sorry, the link that brought you ' +
      'to this page seems to be out of date or broken.'
    );

    const MIS_TOPICID_PROMISE = assert.rejects(
      async () => (await client.deleteTopic()),
      error => {
        assert.strictEqual(error.name, 'NotExistsTopicError');
        assert.strictEqual(error.message, errorMessage);
        return true;
      }
    );

    const promises = [
      MIS_OR_INCORRECT_SECTION_PROMISE,
      MIS_TOPICID_PROMISE,
      MIS_TITLE_PROMISE,
      MIS_POST_PROMISE,
    ];

    await Promise.all(promises);

    const topicId = await client.createTopic({
      title: '323', post: '234', section: 95
    });

    assert.strictEqual(await client.deleteTopic(topicId), true);

  } catch (e) {

    console.log(e.stack);
    process.exit(1);

  }

})();