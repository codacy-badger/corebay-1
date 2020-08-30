const assert = require('assert').strict;

const api = require('../test/api');

const AUTHOR_ID = 68737;

const errorHandler = e => {
  console.log(e.stack);
  process.exit(1);

};

const TYPES = {
  thanks: 'Number',
  name: 'String',
  group: 'String',
  joinDate: 'String',
  posts: 'Number',
  groupId: 'Number'
};

const checkTypes = object => {

  for (const [key, value] of Object.entries(object)) {

    const type = TYPES[key];

    assert.strictEqual(value.constructor.name, type);

  }

};

api.then(client => {

  client.getUser(AUTHOR_ID).then(({ authorData }) => {
    assert(authorData);
    checkTypes(authorData);

  }).catch(errorHandler);

  assert.rejects(
    client.getUser(9999999),
    {
      name: 'Error',
      message: 'Incorrect use of one of the board files'
    }
  ).catch(errorHandler);

}).catch(errorHandler);
