const BaseError = require("./baseError");

/**
 * Error for 422 http status.
 */
class UnprocessableEntityError extends BaseError {
  constructor(data = []) {
    super("Unable to process request", 422, data);
  }
}

module.exports = UnprocessableEntityError;
