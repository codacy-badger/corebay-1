const { http, https, zlib } = require('./dependencies');

const STATUS_CODE_FOR_REDIRECT = new Set([301, 302, 303, 307, 308]);
const GZIP = 3;

const client = protocol => (
  (protocol.startsWith('https') ? https : http).request
);

const getResponse = response => (
  new Promise((resolve, reject) => {
    const chunks = [];
    response
      .once('error', reject)
      .on('data', chunk => chunks.push(chunk))
      .once('end', () => resolve(Buffer.concat(chunks)));
  })
    .then(buffer => {

      const encoding = (
        response.headers['content-encoding'] || ''
      ).toUpperCase();

      buffer = (zlib.constants[encoding] === GZIP)
        ? zlib.unzipSync(buffer)
        : buffer;

      return buffer.toString();
    })
);

const fetch = (method, url, body, headers, redirect) => {
  const {
    hostname,
    pathname,
    search,
    protocol
  } = new URL(url);

  const options = {
    path: pathname + search,
    hostname,
    protocol,
    method,
    headers
  };

  return new Promise((resolve, reject) => {
    client(protocol)(options)
      .once('error', reject)
      .once('response', resolve)
      .end(body);

  })
    .then(response => {

      if (redirect && STATUS_CODE_FOR_REDIRECT.has(response.statusCode)) {
        return fetch(
          method,
          response.headers.location,
          body,
          headers,
          redirect
        );
      }

      return {
        headers: response.headers,
        status: response.statusCode,
        body: () => getResponse(response)
      };
    });
};

module.exports = fetch;
