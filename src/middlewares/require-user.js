'use strict';

const AppError = require('../errors/app-error');

function requireUser(...allowedRoles) {
  return function requireUserMiddleware(req, res, next) {
    if (!req.currentUser) {
      return next(new AppError(401, 'AUTH_REQUIRED', 'Missing X-Demo-User header.'));
    }

    const userRole = String(req.currentUser.role).toUpperCase();
    const roles = allowedRoles.map((r) => String(r).toUpperCase());

    if (!roles.includes(userRole)) {
      return next(new AppError(403, 'FORBIDDEN', 'Insufficient role for this action.'));
    }

    next();
  };
}

module.exports = { requireUser };
