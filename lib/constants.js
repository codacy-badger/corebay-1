const one = 'HARDTEK | TEKNO';
const two = 'DRUM & BASS | JUNGLE | DUBSTEP | BREAKBEAT';
const three = 'HARDCORE | GABBER';
const four = 'TERROR | SPEEDCORE | NOISE';
const five = 'CHIPTUNE | BREAKCORE | SYNTHPOP';
const six = 'TECHNO | HARD TECHNO | ACID | SCHRANZ';
const seven = 'PSYTRANCE | GOATRANCE | PSYCHEDELIC';
const eight = 'HAPPY, UK HARDCORE | HARDSTYLE | JUMPSTYLE';
const nine = 'HOUSE | TRANCE | MINIMAL | DANCE';
const ten = 'IDM | ELECTRO | EXPERIMENTAL | AMBIENT | EBM';

const SECTIONS = Object.freeze({
  16:  'REQUESTS',
  91:  'REQUESTS - FILLED',
  78:  'TRACK ID',
  99:  'TRACK ID - IDENTIFIED',
  77:  'VIDEOS - DVD',
  74:  'VIDEOS - XVID',
  75:  'VIDEOS - CLIP',
  44:  'VIDEOS - TRAINING',
  45:  'SOFTWARE - AUDIO',
  46:  'SOFTWARE - VIDEO',
  139: 'PRODUCTION - INSTRUMENTS',
  141: 'PRODUCTION - PLUGINS',
  140: 'PRODUCTION - SAMPLES',
  159: 'PRODUCTION - OTHER',
  188: 'E-BOOKS',
  143: 'TUTORIALS',
  208: 'HARDWARE',
  7:   'EVENTS',
  6:   'GENERAL',
  62:  'RULES',
  11:  'OFFTOPIC',
  37:  'REVIEW AND DISCUSS',
  97:  'MEMBER - PRODUCTIONS',
  61:  'MEMBER - COLLECTIONS',
  98:  'MEMBER - FTP',
  84:  'FTP',
  85:  'OTHER',
  213: 'OTHER - LOSSLESS',
  69:  `${one} - LABELS`,
  71:  `${one} - ALBUM`,
  72:  `${one} - MIX`,
  175: `${one} - NOT SCENE`,
  176: `${one} - SCENE`,
  145: `${two} - LABELS`,
  171: `${two} - SCENE`,
  172: `${two} - NOT SCENE`,
  136: `${two} - ALBUM`,
  137: `${two} - MIX`,
  210: `${two} - LOSSLESS`,
  52:  `${three} - LABELS`,
  54:  `${three} - ALBUM`,
  55:  `${three} - MIX`,
  179: `${three} - NOT SCENE`,
  180: `${three} - SCENE`,
  209: `${three} - LOSSLESS`,
  64:  `${four} - LABELS`,
  66:  `${four} - ALBUM`,
  67:  `${four} - MIX`,
  181: `${four} - NOT SCENE`,
  182: `${four} - SCENE`,
  193: `${five} - LABELS`,
  195: `${five} - SCENE`,
  196: `${five} - NOT SCENE`,
  197: `${five} - ALBUM`,
  198: `${five} - MIX`,
  92:  `${six} - LABELS`,
  95:  `${six} - ALBUM`,
  96:  `${six} - MIX`,
  173: `${six} - NOT SCENE`,
  174: `${six} - SCENE`,
  212: `${six} - LOSSLESS`,
  166: `${seven} - LABELS`,
  185: `${seven} - NOT SCENE`,
  186: `${seven} - SCENE`,
  168: `${seven} - ALBUM`,
  169: `${seven} - MIX`,
  87:  `${eight} - LABELS`,
  89:  `${eight} - ALBUM`,
  90:  `${eight} - MIX`,
  211: `${eight} - LOSSLESS`,
  177: `${eight} - NOT SCENE`,
  178: `${eight} - SCENE`,
  202: `${nine} - LABELS`,
  204: `${nine} - SCENE`,
  205: `${nine} - NOT SCENE`,
  206: `${nine} - ALBUM`,
  207: `${nine} - MIX`,
  161: `${ten} - LABELS`,
  163: `${ten} - ALBUM`,
  164: `${ten} - MIX`,
  183: `${ten} - NOT SCENE`,
  184: `${ten} - SCENE`
});

const AUTHOR_INFO_KEYS = Object.freeze({
  'Group': ['group', 'string'],
  'Posts': ['posts', 'number'],
  'Thx': ['thanks', 'number'],
  'Joined': ['joinDate', 'string'],
  'Member No.': ['id', 'number'],
  'Member Group': ['group', 'string']
});

const PERMISSIONS = Object.freeze({
  1: { topic: [], post: [], hidecontent: true },
  3: { topic: ['close'], post: ['edit'], hidecontent: true },
  4: { topic: [], post: [], hidecontent: true },
  5: { topic: [], post: [], hidecontent: true },
  8: { topic: [], post: [], hidecontent: true },
  9: { topic: ['close'], post: ['edit'], hidecontent: true },
  10: { topic: ['close', 'delete'], post: ['edit'], hidecontent: false },
  11: { topic: [], post: [], hidecontent: true },
  12: { topic: [], post: [], hidecontent: true },
  13: { topic: [], post: [], hidecontent: true },
  15: { topic: [], post: [], hidecontent: true }
});

const USER_GROUPS = Object.freeze({
  'Validating': 1,
  'Members': 3,
  'Root Admin': 4,
  'Banned': 5,
  'Moderator': 8,
  'Active Member': 9,
  'Special Guest': 10,
  'Bronze Member': 11,
  'Silver Member': 12,
  'Gold Member': 13,
  'Moderator [+ACP]': 15,
  'VIP Member': 17,
  'Donator': 18
});

const PIN_CODE = '15';
const UNPIN_CODE = '16';

const CLOSE_CODE = '00';
const OPEN_CODE = '01';

module.exports = Object.freeze({
  AUTHOR_INFO_KEYS,
  PERMISSIONS,
  USER_GROUPS,
  SECTIONS,
  PIN_CODE,
  UNPIN_CODE,
  OPEN_CODE,
  CLOSE_CODE
});
