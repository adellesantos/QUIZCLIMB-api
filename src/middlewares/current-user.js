'use strict';

const { User } = require('../models');
const AppError = require('../errors/app-error');

async function currentUser(req, res, next) {
  const schoolId = req.get('X-Demo-User');
  if (!schoolId) {
    return next(new AppError(401, 'AUTH_REQUIRED', 'Missing X-Demo-User header.'));
  }

  const user = await User.findOne({ where: { school_id: schoolId } });
  if (!user) {
    return next(new AppError(401, 'AUTH_REQUIRED', 'Unknown X-Demo-User.'));
  }

  req.currentUser = user;
  next();
}

module.exports = currentUser;
