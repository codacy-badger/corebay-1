const dependencies = ['cheerio', 'http', 'https', 'zlib', 'querystring'];

const imported = {};

for (const name of dependencies) imported[name] = Object.freeze(require(name));
imported.iconv = require('iconv-lite');

module.exports = Object.freeze(imported);
