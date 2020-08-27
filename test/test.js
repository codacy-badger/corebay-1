const units = [
  'auth', 'authfails', 'crudtopic', 'gettopic',
  'gettopics', 'pintopic', 'closetopic', 'mergetopic'
];

for (const name of units) require(`./unit.${name}.js`);
