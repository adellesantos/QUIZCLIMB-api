// Last stop for any error thrown in a route. Four arguments = error handler.
// The client gets clean JSON; the stack trace stays in the server log.
const { mapConstraintError } = require('../errors/constraint-map');

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err && err.code && err.statusCode) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    });
  }

  // Map database constraint errors to 409 without exposing SQL.
  if (err && err.parent && err.parent.constraint) {
    const mapped = mapConstraintError(err.parent.constraint);
    return res.status(mapped.status).json({
      error: { code: mapped.code, message: mapped.message },
    });
  }

  const status = err.status || 500;
  const isServerFault = status >= 500;

  res.status(status).json({
    error: {
      code: isServerFault ? 'INTERNAL_ERROR' : err.code || 'BAD_REQUEST',
      message: isServerFault ? 'Something went wrong on the server.' : err.message,
    },
  });
}

module.exports = errorHandler;
