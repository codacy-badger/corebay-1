const assert = require('assert').strict;

const config = require('../test/files/config');
const Client = require('../lib/client');

assert(config);
assert(Client);

const TYPES = {
  name: 'string',
  stats: 'object',
  section: 'object',
  author: 'object',
  replyAuthor: 'object',
  id: 'number',
  views: 'number',
  thanks: 'number',
  replies: 'number',
  createdAt: 'number'
};

const api = new Client(config);

const checkTypes = object => {

  for (const [key, value] of Object.entries(object)) {

    if (typeof value === 'object') checkTypes(value);

    const type = TYPES[key];

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

  try {

    const topics = await api.getTopics();

    assert.strictEqual(Array.isArray(topics) && topics.length > 0, true);

    const [topic] = topics;

    assert(topic);

    checkTypes(topic);

  } catch (e) {

    console.log(e.stack);
    process.exit(1);

  }

})();
