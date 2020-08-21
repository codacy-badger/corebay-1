const extractID = str => parseInt(str.replace(/[^\d]/g, ''), 10);

const extractProtectString = (str, index = 0) => {

  const hex = (str, i) => parseInt(str.substr(i, 2), 16);

  const key = hex(str, index);

  let output = '';

  for (let i = index + 2; i < str.length; i += 2) {
    output += String.fromCharCode(hex(str, i) ^ key);
  }

  try {
    output = decodeURIComponent(encodeURI(output));
  } catch (e) {}

  return output;

};

const extractTitle = str => (
  str.indexOf(' ') > -1
    ? str
      .split(' ')
      .filter(word => !/\[\d+-\d+-\d+\]/.test(word))
      .join(' ')
    : str
);

const extractDescription = str => str.replace(/,\s/, '');

const FORUM_DATE_PATTERN = new RegExp(/(\d+)-(\d+)-(\d+)\s\|\|\s(\d+:\d+)/);

const extractForumTimestamp = date => {
  const [, day, month, year, time] = date.match(FORUM_DATE_PATTERN);
  return Date.parse(`${year}-${month}-${day}T${time}`);
};

const extractTopicTimestamp = (createDate, fts) => {
  if (/minute(?:s)?/.test(createDate)) {
    const mins = parseInt(createDate, 10) || 1;
    return fts - (mins * 60 * 1000);
  }

  const date = new Date(fts);

  if (/yesterday/i.test(createDate)) date.setDate(date.getDate() - 1);

  const [, hour, mins] = createDate.match(/\s(\d+):(\d+)/);

  return date.setHours(hour, mins);

};

module.exports = {
  extractTopicTimestamp,
  extractForumTimestamp,
  extractProtectString,
  extractDescription,
  extractTitle,
  extractID
};
