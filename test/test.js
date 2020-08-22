const units = ['auth', 'gettopics', 'showtopic'];

for (const name of units) require(`./unit.${name}.js`);
