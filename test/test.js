const units = ['auth', 'authfails', 'gettopic', 'gettopics'];

for (const name of units) require(`./unit.${name}.js`);
