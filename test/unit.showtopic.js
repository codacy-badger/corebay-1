const assert = require('assert').strict;

const config = require('../test/files/config.js');
const Client = require('../lib/client');

const api = new Client(config);

const TYPES = {
  id: 'Number',
  createdAt: 'Number',
  thanks: 'Number',
  post: 'String',
  name: 'String',
  title: 'String',
  group: 'String',
  authKey: 'String',
  joinDate: 'String',
  description: 'String',
  author: 'Object',
  whoSaidThanks: 'Array',
  posts: ['Number', 'Array']
};

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

    await api.auth();

  } catch (e) {

    console.log(e.stack);
    process.exit(1);

  }

  const notExistsTopicMessage = (
    'Sorry, the link that brought you ' +
    'to this page seems to be out of date or broken.'
  );

  try {

    await assert.rejects(
      async () => (await api.showTopic()),
      error => {
        assert.strictEqual(error.name, 'NotExistsTopicError');
        assert.strictEqual(error.message, notExistsTopicMessage);
        return true;
      }
    );

  } catch (e) {

    console.log(e.stack);
    process.exit(1);

  }

  const TOPIC_ID = 384768;

  const data = await api.showTopic(TOPIC_ID);

  assert(data);
  checkTypes(data);

})();
