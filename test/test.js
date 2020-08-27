const units = ['auth', 'authfails', 'crudtopic', 'gettopic', 'gettopics'];

for (const name of units) require(`./unit.${name}.js`);
