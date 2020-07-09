/**
 * Base class for all custom errors.
 */
class BaseError extends Error {
  constructor(message, statusCode, data = []) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

module.exports = BaseError;
