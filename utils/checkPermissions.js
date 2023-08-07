const customError = require('../errors');
const checkPermissions = (requestUser, resourceUser) => {
  if (requestUser.role === 'admin') return;
  if (resourceUser.toString() === requestUser.userId) return;
  throw new customError.UnauthenticatedError('Unauthorized to access');
};

module.exports = { checkPermissions };
