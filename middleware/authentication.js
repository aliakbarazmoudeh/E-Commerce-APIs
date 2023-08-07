const customError = require('../errors');
const { isTokenValid } = require('../utils');

const authenicate = (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new costomError.UnauthenticatedError('invalid authentication');
  }
  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new customError.UnauthenticatedError('invalid authentication');
  }
};

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new customError.ForbiddenError('Unauthrized to access this routes');
    }
    next();
  };
};

module.exports = { authenicate, authorizePermission };
