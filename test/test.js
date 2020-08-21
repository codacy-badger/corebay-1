const units = ['auth', 'gettopics', 'topicparser', 'showtopic'];

for (const name of units) require(`./unit.${name}.js`);
