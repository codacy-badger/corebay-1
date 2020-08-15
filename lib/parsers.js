const { cheerio } = require('./dependencies');
const SECTIONS = require('./constants');
const {
  extractTopicTimestamp,
  extractForumTimestamp,
  extractProtectString,
  extractTitle,
  extractID
} = require('./utils');


const errorParser = body => {

  const $ = cheerio.load(body);

  return $('.postcolor, .errorwrap p').eq(0).text();

};

const topicParser = body => {

  const $ = cheerio.load(body);

  const ts = extractForumTimestamp(
    $('#gfooter tbody tr td')
      .eq(2)
      .text()
  );

  return $('.ipbtable tr:not(:last-child)')
    .map(function () {
      const tr = $(this);

      if (tr.children().length < 8) return;

      const topicID = extractID(
        tr
          .find('a')
          .attr('href')
      );

      const topicName = extractTitle(
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
        .find('a span')
        .slice(1)
        .eq(-1)
        .text();

      const createdAt = extractTopicTimestamp(
        tr
          .find('.desc')
          .clone()
          .children()
          .remove()
          .end()
          .text()
          .trim(),
        ts
      );

      return {
        topicID,
        topicName,
        userID,
        userName,
        createdAt,
        sectionID,
        sectionName: SECTIONS[sectionID]
      };
    })
    .get();

};

module.exports = { topicParser, errorParser };
