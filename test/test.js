const units = [
  'authfails', 'gettopic', 'gettopics', 'pintopic',
  'closetopic', 'mergetopic', 'createtopic', 'movetopic',
  'edittopic', 'deletetopic', 'saythanks', 'getuser'
];

for (const name of units) require(`./unit.${name}.js`);
