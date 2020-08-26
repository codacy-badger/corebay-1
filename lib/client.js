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

    }

    get _isAuthorized() {
      return Object.keys(this.#cookies).length > 0;

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

    async _fetch(method, query, body = undefined, redirect = true) {

      if (this._isAuthorized === false) await this.auth();

      const url = this._buildQueryURL(query);

      const headers = { ...this.headers, cookie: this.#cookies };

      return fetch(method, url, body, headers, redirect);

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

      const url = this._buildQueryURL(query);

      const redirect = false;

      const response = await fetch('POST', url, form, this.headers, redirect);

      if (response.status === 302) {
        this._extractCookie(response.headers['set-cookie']);

      }

      const body = await response.body();

      const { error } = new Parser(body);

      if (error) throw new AuthorizationError(error);

      return true;

    }

    async getTopics() {
      const query = {
        act: 'Search',
        CODE: 'getnewtopics'
      };

      const body = await this._fetch('GET', query).then(res => res.body());

      const { topicsData } = new Parser(body);

      return topicsData;

    }

    async getTopic(id) {
      const query = {
        showtopic: id
      };

      const body = await this._fetch('GET', query).then(res => res.body());

      const parsed = new Parser(body);

      if (parsed.error) throw new NotExistsTopicError(parsed.error);

      return parsed;

    }
}

module.exports = CoreBay;
