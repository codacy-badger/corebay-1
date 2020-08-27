const assert = require('assert').strict;

const api = require('../test/api');

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

const checkTypes = object => {

  for (const [key, value] of Object.entries(object)) {

    if (typeof value === 'object') checkTypes(value);

    const type = TYPES[key];

    assert.strictEqual(typeof value, type);

  }

};

const errorHandler = e => {
  console.log(e.stack);
  process.exit(1);

};

api.then(client => client.getTopics())
  .then(topics => {

    assert.strictEqual(Array.isArray(topics), true);
    assert.strictEqual(topics.length > 0, true);

    const [topic] = topics;

    assert(topic);

    checkTypes(topic);

  }).catch(errorHandler);
