const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];

  function generateInternalCode() {
    if (err.message.match(/(E|e)mail/g)) return 400001
  }

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400, generateInternalCode());
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400, 400002);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401, 401002);


const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401, 401003);

const sendErrorDev = (err, req, res) => {
  // A) API
  console.log(err)
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    internalStatusCode: err.internalStatusCode,
    stack: err.stack
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  console.error(err);
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      internalStatusCode: err.internalStatusCode,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  // 2) Send generic message
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!'
  });
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  // Authentication error from Passportjs
  if (err.name === 'AuthenticationError') {
    return res.status(401).json({
      status: 'error',
      internalStatusCode: 401000,
      message: 'You are not logged in! Please log in to get access.'
    })
  }

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError' || error?._message && error._message.includes('validation'))
    error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === 'production') {

    sendErrorProd(error, req, res);
  }
};
