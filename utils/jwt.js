const JWT = require('jsonwebtoken');

const createJWT = (payload) => {
  return JWT.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

const isTokenValid = ({ token }) => JWT.verify(token, process.env.JWT_SECRET);

const attachCookieToRespon = (res, user) => {
  const token = createJWT(user);
  const oneDay = 1000 * 60 * 60 * 24;
  res
    .status(200)
    .cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now + oneDay),
      secure:process.env.NODE_ENV === 'production',
      signed: true,
    })
    .json({ user });
  res.send();
};

module.exports = { createJWT, isTokenValid, attachCookieToRespon };
