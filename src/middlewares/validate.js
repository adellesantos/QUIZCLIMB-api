'use strict';

const { validationResult, matchedData } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const fieldErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input.',
        fields: fieldErrors,
      },
    });
  }
  req.validated = matchedData(req);
  next();
}

module.exports = { validate };
