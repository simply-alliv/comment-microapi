const BaseError = require("./baseError");

/**
 * Error for 404 http status.
 */
class NotFoundError extends BaseError {
  constructor(resource) {
    super(`Resource ${resource} does not exist or has been deleted`, 404);
  }
}

module.exports = NotFoundError;
