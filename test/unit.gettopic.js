const assert = require('assert').strict;

const api = require('../test/unit.auth');

const TYPES = {
  id: 'Number',
  createdAt: 'Number',
  thanks: 'Number',
  post: 'String',
  name: 'String',
  title: 'String',
  group: 'String',
  joinDate: 'String',
  description: 'String',
  author: 'Object',
  whoSaidThanks: 'Array',
  posts: ['Number', 'Array']
};

const errorMessage = (
  'Sorry, the link that brought you ' +
  'to this page seems to be out of date or broken.'
);

const checkTypes = object => {

  if (Array.isArray(object)) {

    for (const k of object) checkTypes(k);

    return;

  }

  for (const [key, value] of Object.entries(object)) {

    if (['Object', 'Array'].includes(value.constructor.name)) checkTypes(value);

    const type = TYPES[key];

    if (key === 'posts') {
      assert.strictEqual(type.includes(value.constructor.name), true);

      return;
    }

    assert.strictEqual(value.constructor.name, type);

  }

};

(async () => {

  try {

    const client = await api;

    await assert.rejects(
      async () => (await client.getTopic()),
      error => {
        assert.strictEqual(error.name, 'NotExistsTopicError');
        assert.strictEqual(error.message, errorMessage);
        return true;
      }
    );

    const TOPIC_ID = 384768;

    const data = await client.getTopic(TOPIC_ID);

    assert(data.topicData);
    checkTypes(data.topicData);

  } catch (e) {

    console.log(e.stack);
    process.exit(1);

  }

})();
