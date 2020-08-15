const fetch = require('./fetch');
const { topicParser, errorParser } = require('./parsers');
const { querystring } = require('./dependencies');

const AuthorizationError = require('./errors');

class CoreBay {
    #username;
    #password;
    #anonymous;
    #cookies;

    constructor(username, password, anonymous = 0) {
      if (typeof username === 'object') {
        anonymous = username.anonymous ? username.anonymous : anonymous;
        password = username.password;
        username = username.username;

      }

      this.#username = username;
      this.#password = password;
      this.#anonymous = anonymous;
      this.#cookies = {};
      this.headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
        'accept-encoding': 'gzip, deflate',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded',
      };

    }

    get _isAuthorized() {
      return Object.keys(this.#cookies).length > 0;

    }

    _buildSearchURL(query) {

      const url = new URL('https://www.corebay.co/index.php');

      for (const [key, value] of Object.entries(query)) {
        url.searchParams.set(key, value);
      }

      return url.toString();

    }

    _extractCookie(cookies) {
      return cookies.map(cookie => cookie.substr(0, cookie.indexOf(';')));
    }

    async _call(method, query, body = undefined, redirect = true) {

      if (this._isAuthorized === false) await this.auth();

      const url = this._buildSearchURL(query);

      const headers = { ...this.headers, cookie: this.#cookies };

      return fetch(method, url, body, headers, redirect);

    }

    auth() {
      const body = querystring.stringify({
        UserName: this.#username,
        PassWord: this.#password,
        Privacy: this.#anonymous,
        act: 'Login',
        CODE: '01',
        CookieDate: 1,
        submit: 'Log me'
      });

      const query = {
        act: 'Login',
        CODE: '01'
      };

      const url = this._buildSearchURL(query);

      const redirect = false;

      return fetch('POST', url, body, this.headers, redirect)
        .then(response => {
          if (response.status === 302) {
            this.#cookies = this._extractCookie(response.headers['set-cookie']);
          }

          return response;
        })
        .then(response => response.body())
        .then(body => {

          if (body === '') return;

          const errorMessage = errorParser(body);

          throw new AuthorizationError(errorMessage);
        });

    }

    getTopics() {
      const query = {
        act: 'Search',
        CODE: 'getnewtopics'
      };

      return this._call('GET', query)
        .then(response => response.body())
        .then(body => topicParser(body));

    }
}

module.exports = CoreBay;
