class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

class NotExistsTopicError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotExistsTopicError';
  }
}

module.exports = { AuthorizationError, NotExistsTopicError };
