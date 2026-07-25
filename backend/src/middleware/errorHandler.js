const { error } = require('../helpers/response');

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.stack || err.message);

  if (err.name === 'SequelizeValidationError') {
    return error(res, 'Database validation error', 422, err.errors.map(e => ({ field: e.path, message: e.message })));
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return error(res, 'Duplicate entry. This record already exists.', 409);
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return error(res, 'File too large. Maximum size is 5MB.', 413);
  }
  if (err.message && err.message.includes('Only image files')) {
    return error(res, err.message, 400);
  }

  return error(res, err.message || 'Internal Server Error', err.status || 500);
};

module.exports = errorHandler;
