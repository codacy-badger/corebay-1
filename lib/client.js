const fetch = require('./fetch');
const Parser = require('./parser');
const { querystring } = require('./dependencies');

const {
  NotExistsTopicError,
  AuthorizationError,
} = require('./errors');

const HEADERS = {
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
  'accept-encoding': 'gzip, deflate',
  'accept-language': 'en-US,en;q=0.9',
  'content-type': 'application/x-www-form-urlencoded'
};

class CoreBay {
    #username;
    #password;
    #cookies;

    constructor(username, password, anonymous = 0) {
      if (typeof username === 'object') {
        anonymous = username.anonymous ? username.anonymous : anonymous;
        password = username.password;
        username = username.username;

      }

      this.#username = username;
      this.#password = password;
      this.#cookies = [];
      this.anonymous = anonymous;
      this.headers = HEADERS;
      return this.auth();

    }

    _buildQueryURL(query) {

      const url = new URL('https://www.corebay.co/index.php');

      for (const [key, value] of Object.entries(query)) {
        url.searchParams.set(key, value);
      }

      return url.toString();

    }

    _extractCookie(cookies) {
      for (const cookie of cookies) {
        this.#cookies.push(cookie.substr(0, cookie.indexOf(';')));

      }
    }

    async _fetch(...args) {

      const [method, query, form = null, redirect = true] = args;

      const url = this._buildQueryURL(query);

      const headers = { ...this.headers, cookie: this.#cookies };

      const response = await fetch(method, url, form, headers, redirect);

      const body = await response.body();

      const parsed = new Parser(body);

      delete response.body;

      if (this.#cookies.length === 0) {
        this._extractCookie(response.headers['set-cookie']);

      }

      return { ...response, parsed };

    }

    async auth() {
      const form = querystring.stringify({
        UserName: this.#username,
        PassWord: this.#password,
        Privacy: this.anonymous,
        CookieDate: 1,
        submit: 'Log me'
      });

      const query = {
        act: 'Login',
        CODE: '01'
      };

      const redirect = false;

      const { parsed } = await this._fetch('POST', query, form, redirect);

      if (parsed.error) throw new AuthorizationError(parsed.error);

      return this;

    }

    async getTopics() {
      const query = {
        act: 'Search',
        CODE: 'getnewtopics'
      };

      const { parsed } = await this._fetch('GET', query);

      return parsed.topicsData;

    }

    async getTopic(id) {
      const query = {
        showtopic: id
      };

      const { parsed } = await this._fetch('GET', query);

      if (parsed.error) throw new NotExistsTopicError(parsed.error);

      return parsed;

    }

    async createTopic(options) {
      const form = {
        act: 'Post',
        CODE: '01',
        st: 0,
        removeattachid: 0,
        poll_question: '',
        ffont: 0,
        fsize: 0,
        enableemo: 'yes',
        enablesig: 'yes',
        TopicTitle: options.title,
        f: options.section,
        Post: options.post,
        Privacy: options.privacy ? options.privacy : this.anonymous
      };

      const query = {
        act: 'post',
        do: 'new_post',
        f: options.section
      };

      const response = await this._fetch('GET', query);

      const { error, authKey, postKey } = response.parsed;

      if (error) throw new Error(error);

      form.auth_key = authKey;
      form.post_key = postKey;

      const res = await this._fetch('POST', {}, querystring.stringify(form));

      const { parsed } = res;

      if (parsed.error) throw new Error(parsed.error);

      return parsed.topicId;

    }

    async deleteTopic(id) {
      const form = {
        CODE: '03',
        act: 'Mod',
        st: '',
        t: id
      };

      const { authKey, sectionId } = await this.getTopic(id);

      form.auth_key = authKey;
      form.f = sectionId;

      const redirect = false;

      await this._fetch('POST', {}, querystring.stringify(form), redirect);

      return true;

    }
}

module.exports = CoreBay;
