const { createJWT, isTokenValid, attachCookieToRespon } = require('./jwt');
const { createTokenUser } = require('./createTokenUser');
const { checkPermissions } = require('./checkPermissions');
module.exports = {
  createJWT,
  isTokenValid,
  attachCookieToRespon,
  createTokenUser,
  checkPermissions
};
