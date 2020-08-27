const assert = require('assert').strict;

const api = require('../test/api');

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

const TOPIC_ID = 384768;

const errorMessage = (
  'Sorry, the link that brought you ' +
  'to this page seems to be out of date or broken.'
);

const errorHandler = e => {
  console.log(e.stack);
  process.exit(1);

};

api.then(client => {

  client.getTopic(TOPIC_ID).then(({ topicData }) => {

    assert(topicData);
    checkTypes(topicData);

  }).catch(errorHandler);

  assert.rejects(
    client.getTopic(),
    {
      name: 'NotExistsTopicError',
      message: errorMessage
    }
  ).catch(errorHandler);

}).catch(errorHandler);
