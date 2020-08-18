const units = ['auth', 'gettopics'];

for (const name of units) require(`./unit.${name}.js`);
