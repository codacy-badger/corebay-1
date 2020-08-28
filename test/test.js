const units = [
  'authfails', 'gettopic', 'gettopics', 'pintopic',
  'closetopic', 'mergetopic', 'createtopic', 'movetopic',
  'edittopic', 'deletetopic', 'saythanks'
];

for (const name of units) require(`./unit.${name}.js`);
