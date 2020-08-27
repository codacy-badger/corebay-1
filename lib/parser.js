const { cheerio } = require('./dependencies');

const {
  AUTHOR_INFO_KEYS,
  SECTIONS
} = require('./constants');

const {
  extractForumTimestamp,
  extractProtectString,
  extractDescription,
  extractTimestamp,
  extractTitle,
  extractID
} = require('./utils');

const TEXT_NODE = 3;

class Parser {
  constructor(body) {
    this.$ = cheerio.load(body);
  }

  get forumTimestamp() {
    return extractForumTimestamp(
      this.$('#gfooter td[align="right"]').text()
    );
  }

  get authKey() {
    return this.$('input[name="auth_key"]').val();
  }

  get postKey() {
    return this.$('input[name="post_key"]').val();
  }

  get sectionId() {
    return this.$('input[name="forums"]').val();
  }

  get topicId() {
    return this.$('input[name="topic"]').val();
  }

  get pinned() {
    return extractID(this.$('[name="CODE"] [value="15"], [value="16"]').val());
  }

  get closed() {
    return this.$('[name="CODE"] [value="00"], [value="01"]').val();
  }

  get error() {
    return this.$('div > .postcolor, .errorwrap p').eq(0).text();
  }

  get topicData() {
    const { $, forumTimestamp } = this;

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

    const posts = $('.ipbtable[cellspacing="1"]')
      .map(function () {
        const $$ = $(this);

        const id = extractID($$.find('.postcolor').attr('id'));

        const post = $$.find('.postcolor').text();

        const createdAt = extractTimestamp(
          $$.find('.postdetails').text(),
          forumTimestamp
        );

        const author = {
          name: $$.find('b > span > span').text()
        };

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

    return { title, description, posts };
  }

  get topicsData() {
    const { $, forumTimestamp } = this;
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

        const replyAuthorID = extractID(
          tr
            .find('.row1 .desc a')
            .attr('href')
        );

        const replyAuthorName = tr
          .find('.row1 .desc span')
          .text();

        const createdAt = extractTimestamp(
          tr
            .find('.row1 .desc')
            .clone()
            .children()
            .remove()
            .end()
            .text()
            .trim(),
          forumTimestamp
        );

        return {
          id,
          name,
          createdAt,
          author: {
            id: userID,
            name: userName
          },
          replyAuthor: {
            id: replyAuthorID,
            name: replyAuthorName
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
  }


}

module.exports = Parser;
