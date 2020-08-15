const dependencies = ['cheerio', 'http', 'https', 'zlib', 'querystring'];

const imported = {};

for (const name of dependencies) imported[name] = Object.freeze(require(name));

module.exports = imported;
