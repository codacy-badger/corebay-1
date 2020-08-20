const fsp = require('fs').promises;
const path = require('path');
const assert = require('assert').strict;

const { topicParser } = require('../lib/parsers');

const BODY_PATH = path.join(__dirname, 'files', 'topics.html');
const JSON_PATH = path.join(__dirname, 'files', 'topics.json');

assert(topicParser);

(async () => {

  const [body, json] = await Promise.all([
    fsp.readFile(BODY_PATH, 'utf8'),
    fsp.readFile(JSON_PATH, 'utf8')
  ]);

  try {

    const jsonData = JSON.parse(json);

    const topicsData = topicParser(body);

    assert.deepEqual(topicsData, jsonData);

  } catch (e) {

    console.log(e.stack);
    process.exit(1);

  }

})();
