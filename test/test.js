const units = [
  'auth', 'authfails', 'crudtopic', 'gettopic',
  'gettopics', 'pintopic'
];

for (const name of units) require(`./unit.${name}.js`);
