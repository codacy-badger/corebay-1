const assert = require('assert').strict;

const config = require('../test/files/config');
const Client = require('../lib/client');

assert(config);
assert(Client);

(async () => {

  try {

    const api = new Client(config);

    await api.auth();

    const topics = await api.getTopics();

    assert.strictEqual(Array.isArray(topics) && topics.length > 0, true);

    const [topic] = topics;

    assert.strictEqual(typeof topic.topicID, 'number');
    assert.strictEqual(typeof topic.userID, 'number');
    assert.strictEqual(typeof topic.createdAt, 'number');
    assert.strictEqual(typeof topic.sectionID, 'number');
    assert.strictEqual(typeof topic.userName, 'string');
    assert.strictEqual(typeof topic.sectionName, 'string');
    assert.strictEqual(typeof topic.topicName, 'string');

  } catch (e) {

    console.log(e.stack);
    process.exit(1);

  }

})();
