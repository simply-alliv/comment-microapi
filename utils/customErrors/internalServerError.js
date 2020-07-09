const BaseError = require("./baseError");

/**
 * Error for 500 http status.
 */
class InternalServerError extends BaseError {
  constructor() {
    super("Something went wrong, please try again later.", 500);
  }
}

module.exports = InternalServerError;
