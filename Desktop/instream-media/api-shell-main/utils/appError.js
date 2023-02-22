class AppError extends Error {
  constructor(message, statusCode, internalStatusCode) {
    super(message);

    this.statusCode = statusCode;
    this.internalStatusCode = internalStatusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;