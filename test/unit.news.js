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

api.then(client => {

  Promise.all([
    client.news('post'),
    client.news('topic'),
  ]).then(results => {

    for (const result of results) {

      assert.strictEqual(Array.isArray(result), true);

      for (const object of result) {

        assert(object);
        checkTypes(object);

      }

    }

  }).catch(errorHandler);

}).catch(errorHandler);
