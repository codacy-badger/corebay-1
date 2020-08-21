const { cheerio } = require('./dependencies');

const {
  AUTHOR_INFO_KEYS,
  SECTIONS
} = require('./constants');

const {
  extractTopicTimestamp,
  extractForumTimestamp,
  extractProtectString,
  extractDescription,
  extractTitle,
  extractID
} = require('./utils');


const errorParser = body => {

  const $ = cheerio.load(body);

  return $('div > .postcolor, .errorwrap p').eq(0).text();

};

const topicParser = body => {

  const $ = cheerio.load(body);

  const ts = extractForumTimestamp(
    $('#gfooter td[align="right"]').text()
  );

  return $('.ipbtable tr:not(:last-child)')
    .map(function () {
      const tr = $(this);

      if (tr.children().length < 8) return;

      const id = extractID(
        tr
          .find('a')
          .attr('href')
      );

      const name = extractTitle(
        tr
          .find('span[style="font-size: 10px"]')
          .contents()
          .each(function () {
            const data = $(this).data('cfemail');
            if (data) {
              const extracted = extractProtectString(data);
              $(this).text(extracted);

            }
          })
          .text()
      );

      const sectionID = extractID(
        tr
          .find('.forumdesc a')
          .attr('href')
      );

      const userID = extractID(
        tr
          .find('.row1 a')
          .attr('href')
      );

      const userName = tr
        .find('td[align="center"] a span')
        .text();

      const [replies, thanks] = tr
        .find('td[align="center"].row2 a')
        .text()
        .split(' + ')
        .map(extractID);

      const views = extractID(
        tr
          .find('td:nth-child(7) a')
          .text()
      );

      const commentatorID = extractID(
        tr
          .find('.row1 .desc a')
          .attr('href')
      );

      const commentatorName = tr
        .find('.row1 .desc span')
        .text();

      const createdAt = extractTopicTimestamp(
        tr
          .find('.row1 .desc')
          .clone()
          .children()
          .remove()
          .end()
          .text()
          .trim(),
        ts
      );

      return {
        id,
        name,
        createdAt,
        topicStarter: {
          id: userID,
          name: userName
        },
        commentator: {
          id: commentatorID,
          name: commentatorName
        },
        section: {
          id: sectionID,
          name: SECTIONS[sectionID]
        },
        stats: {
          views,
          thanks,
          replies
        }
      };
    })
    .get();

};

const TEXT_NODE = 3;

const showTopicParser = body => {

  const $ = cheerio.load(body);

  const authKey = $('input[name="auth_key"]').val();

  const title = extractTitle(
    $('#bold').text()
  );

  const elementDesc = $('#bold')
    .parent()
    .contents()
    .last();

  const description = (
    elementDesc.get(0).nodeType === TEXT_NODE
      ? extractDescription(elementDesc.text())
      : ''
  );

  const ts = extractForumTimestamp(
    $('#gfooter td[align="right"]').text()
  );

  const posts = $('.ipbtable[cellspacing="1"]')
    .map(function () {
      const $$ = $(this);

      const id = extractID($$.find('.postcolor').attr('id'));

      const post = $$.find('.postcolor').text();

      const createdAt = extractTopicTimestamp(
        $$.find('.postdetails').text(),
        ts
      );

      const author = {};

      $$.find('td > .postdetails')
        .contents()
        .each(function () {
          const text = $(this).text().trim();

          let [key, value] = text.split(':');

          const exists = AUTHOR_INFO_KEYS[key.trim()];

          if (exists) {

            key = exists[0];
            value = value.trim();

            author[key] = exists[1] === 'number' ? extractID(value) : value;

          }
        });

      const whoSaidThanks = $$.find('.signature a')
        .map(function () {
          const a = $(this);

          const id = extractID(
            a
              .attr('href')
          );

          const name = a.text();

          return { id, name };
        })
        .get();

      return {
        id,
        post,
        author,
        createdAt,
        whoSaidThanks,
      };

    })
    .get();

  return { title, authKey, description, posts };

};

module.exports = { topicParser, errorParser, showTopicParser };
