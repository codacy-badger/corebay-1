const units = [
  'auth', 'authfails', 'crudtopic', 'gettopic',
  'gettopics', 'pintopic', 'closetopic'
];

for (const name of units) require(`./unit.${name}.js`);
