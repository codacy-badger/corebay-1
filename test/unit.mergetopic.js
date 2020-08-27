const assert = require('assert').strict;

const api = require('../test/unit.auth');

const errorMessage = (
  'We could not find a topic in the database that ' +
  'matches the URL you entered, please try again and ' +
  'double check the information entered'
);

const TOPIC = {
  title: '323', post: '234', section: 95
};

(async () => {

  try {

    const client = await api;

    const to = await client.createTopic(TOPIC);
    const from = await client.createTopic(TOPIC);

    const FAILED_MERGE_PROMISE = assert.rejects(
      async () => (await client.mergeTopic(257766, 54353)),
      error => {
        assert.strictEqual(error.name, 'Error');
        assert.strictEqual(error.message, errorMessage);
        return true;
      }
    );

    const results = await Promise.all([
      FAILED_MERGE_PROMISE,
      client.mergeTopic(to, from),
      client.deleteTopic(to)
    ]);

    assert.deepStrictEqual(results, [
      undefined, true, true
    ]);

  } catch (e) {

    console.log(e.stack);
    process.exit(1);

  }

})();
