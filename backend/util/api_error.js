// api_error.js

function ApiError(status_code, message = "Something went wrong", error = [], stack = "") {
    if (!(this instanceof ApiError)) {
      return new ApiError(status_code, message, error, stack);
    }
  
    Error.call(this, message);
  
    this.status_code = status_code;
    this.data = null;
    this.message = message;
    this.success = false;
    this.error = error;
  
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = ApiError;
  