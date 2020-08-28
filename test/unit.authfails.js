const assert = require('assert').strict;

const config = require('../test/files/config');
const Client = require('../lib/client');

assert(config);
assert(Client);

(async () => {

  const emptyUsernamePromise = assert.rejects(
    async () => (await new Client()),
    error => {
      assert.strictEqual(error.name, 'AuthorizationError');
      assert.strictEqual(error.message, 'You must enter a username');
      return true;
    }
  );

  const emptyPasswordPromise = assert.rejects(
    async () => (await new Client(config.moder.username)),
    error => {
      assert.strictEqual(error.name, 'AuthorizationError');
      assert.strictEqual(error.message, 'Your password field was not complete');
      return true;
    }
  );

  const incorrectUserMessage = (
    'Sorry, we could not find ' +
    'a member using those log in details.'
  );

  const incorrectUserPromise = assert.rejects(
    async () => (await new Client('testtesttest', '1234567')),
    error => {
      assert.strictEqual(error.name, 'AuthorizationError');
      assert.strictEqual(error.message, incorrectUserMessage);
      return true;
    }
  );


  const incorrectPasswordPromise = assert.rejects(
    async () => (await new Client(config.moder.username, '1234567')),
    error => {
      assert.strictEqual(error.name, 'AuthorizationError');
      assert.strictEqual(error.message, 'Username or password incorrect');
      return true;
    }
  );


  const promises = [
    emptyUsernamePromise,
    emptyPasswordPromise,
    incorrectUserPromise,
    incorrectPasswordPromise,
  ];

  try {

    await Promise.all(promises);

  } catch (e) {

    console.error(e.stack);
    process.exit(1);
  }

})();
