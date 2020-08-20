const units = ['auth', 'gettopics', 'topicparser'];

for (const name of units) require(`./unit.${name}.js`);
