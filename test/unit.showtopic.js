const assert = require('assert').strict;

const config = require('../test/files/config.js');
const Client = require('../lib/client');

const api = new Client(config);

const TYPES = {
  id: 'number',
  thanks: 'number',
  createdAt: 'number',
  postsNumber: 'number',
  thanksNumber: 'number',
  post: 'string',
  name: 'string',
  title: 'string',
  group: 'string',
  authKey: 'string',
  joinDate: 'string',
  description: 'string',
  author: 'object',
  posts: 'object',
  whoSaidThanks: 'object'
};
const checkTypes = array => {

  // const iter = Object.entries(array);

  for (const [key, value] of Object.entries(array)) {

    if (Array.isArray(value)) for (const val of value) checkTypes(val);
    if (typeof value === 'object' && !Array.isArray(value)) checkTypes(value);

    const type = TYPES[key];

    console.log(key, type, value);
    assert.strictEqual(typeof value, type);

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
