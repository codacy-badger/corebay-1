const units = ['auth', 'gettopics', 'gettopic'];

for (const name of units) require(`./unit.${name}.js`);
