const fetch = require('./fetch');
const Parser = require('./parser');

const { TYPE_NEWS } = require('./constants');

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
      const form = {
        UserName: this.#username,
        PassWord: this.#password,
        Privacy: this.anonymous,
        CookieDate: 1,
        submit: 'Log me'
      };

      const query = {
        act: 'Login',
        CODE: '01'
      };

      const redirect = false;

      const { parsed } = await this._fetch('POST', query, form, redirect);

      if (parsed.error) throw new AuthorizationError(parsed.error);

      return this;

    }

    async news(type = 'topic', seconds = 86400) {
      const query = {
        active: 1,
        act: 'search',
        CODE: TYPE_NEWS[type]
      };

      const form = { lastdate: seconds };

      const { parsed } = await this._fetch('POST', query, form);

      if (parsed.errorNews) throw new Error(parsed.errorNews);

      return parsed.newsData;

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

      const res = await this._fetch('POST', {}, form);

      const { parsed } = res;

      if (parsed.error) throw new Error(parsed.error);

      return parsed.topicId;

    }

    async deleteTopic(id) {
      const form = {
        CODE: '08',
        act: 'mod',
        s: '',
        st: '0',
        submit: 'Delete this topic',
        t: id
      };

      const { authKey, sectionId } = await this.getTopic(id);

      form.auth_key = authKey;
      form.f = sectionId;

      const redirect = false;

      await this._fetch('POST', {}, form, redirect);

      return true;

    }

    async moveTopic(id, to, source = false) {
      const form = {
        CODE: '14',
        act: 'mod',
        s: '',
        st: '0',
        submit: 'Move this topic',
        selectedpids: '',
        move_id: to,
        tid: id,
        leave: source ? 'y' : 'n',
      };

      const { authKey, sectionId } = await this.getTopic(id);

      form.f = sectionId;
      form.sf = sectionId;
      form.auth_key = authKey;

      const redirect = false;

      const res = await this._fetch('POST', {}, form, redirect);

      const { parsed } = res;

      if (parsed.error) throw new Error(parsed.error);

      return true;

    }

    async mergeTopic(id, from, title, desc) {
      const form = {
        CODE: '61',
        act: 'mod',
        s: '',
        st: '0',
        submit: 'Merge Topics',
        selectedpids: '',
        topic_url: this._buildQueryURL({ showtopic: from }),
        t: id,
      };

      const { authKey, sectionId, topicData } = await this.getTopic(id);

      form.title = title || topicData.title;
      form.desc = desc || topicData.description;
      form.f = sectionId;
      form.auth_key = authKey;

      const redirect = false;

      const { parsed } = await this._fetch('POST', {}, form, redirect);

      if (parsed.error) throw new Error(parsed.error);

      return true;

    }

    async editTopic(id, title, desc) {
      const form = {
        CODE: '12',
        act: 'mod',
        s: '',
        st: '0',
        submit: 'Edit this topic',
        selectedpids: '',
        t: id
      };

      const { authKey, sectionId, topicData } = await this.getTopic(id);

      form.TopicTitle = title || topicData.title;
      form.TopicDesc = desc || topicData.description;
      form.auth_key = authKey;
      form.f = sectionId;

      const redirect = false;

      await this._fetch('POST', {}, form, redirect);

      return true;
    }

    async pinTopic(id) {
      const form = {
        act: 'Mod',
        st: '0',
        t: id
      };

      const { authKey, sectionId, pinned } = await this.getTopic(id);

      form.f = sectionId;
      form.auth_key = authKey;
      form.CODE = pinned;

      const redirect = false;

      await this._fetch('POST', {}, form, redirect);

      return pinned;
    }

    async closeTopic(id) {
      const form = {
        act: 'Mod',
        st: '0',
        t: id
      };

      const { authKey, sectionId, closed } = await this.getTopic(id);

      form.f = sectionId;
      form.auth_key = authKey;
      form.CODE = closed;

      const redirect = false;

      await this._fetch('POST', {}, form, redirect);

      return closed;

    }

    async sayThanks(topicId, postId, section) {
      const query = {
        act: 'thanks',
        pid: postId,
        f: section,
        t: topicId
      };

      const { parsed } = await this._fetch('POST', query);

      if (parsed.error) throw new Error(parsed.error);

      const { topicData } = parsed;

      const post = topicData.posts.find(post => post.id === postId);

      return post;

    }

    async getUser(id) {
      const query = {
        showuser: id
      };

      const { parsed } = await this._fetch('GET', query);

      if (parsed.error) throw new Error(parsed.error);

      return parsed;

    }

}

module.exports = CoreBay;
