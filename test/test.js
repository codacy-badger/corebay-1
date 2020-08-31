const units = [
  'authfails', 'gettopic', 'pintopic',
  'closetopic', 'mergetopic', 'createtopic', 'movetopic',
  'edittopic', 'deletetopic', 'saythanks', 'getuser', 'news'
];

for (const name of units) require(`./unit.${name}.js`);
