const assert = require('assert').strict;

const config = require('../test/files/config');
const Client = require('../lib/client');

assert(config);
assert(Client);

(async () => {

  const emptyUsername = new Client();

  const emptyUsernamePromise = assert.rejects(
    async () => (await emptyUsername.auth()),
    error => {
      assert.strictEqual(error.name, 'AuthorizationError');
      assert.strictEqual(error.message, 'You must enter a username');
      return true;
    }
  );

  const emptyPassword = new Client(config.username);

  const emptyPasswordPromise = assert.rejects(
    async () => (await emptyPassword.auth()),
    error => {
      assert.strictEqual(error.name, 'AuthorizationError');
      assert.strictEqual(error.message, 'Your password field was not complete');
      return true;
    }
  );

  const notFoundUser = new Client('testtesttest', '1234567');

  const notFoundMessage = (
    'Sorry, we could not find ' +
    'a member using those log in details.'
  );

  const notFoundUserPromise = assert.rejects(
    async () => (await notFoundUser.auth()),
    error => {
      assert.strictEqual(error.name, 'AuthorizationError');
      assert.strictEqual(error.message, notFoundMessage);
      return true;
    }
  );

  const incorrectPassword = new Client(config.username, '1234567');

  const incorrectPasswordPromise = assert.rejects(
    async () => (await incorrectPassword.auth()),
    error => {
      assert.strictEqual(error.name, 'AuthorizationError');
      assert.strictEqual(error.message, 'Username or password incorrect');
      return true;
    }
  );

  const successfulAuthorization = new Client(config);

  const promises = [
    emptyUsernamePromise,
    emptyPasswordPromise,
    notFoundUserPromise,
    incorrectPasswordPromise,
  ];

  try {

    await Promise.all(promises);
    const ok = await successfulAuthorization.auth();

    assert.strictEqual(ok, undefined);

  } catch (e) {

    console.error(e.stack);
    process.exit(1);
  }

})();
