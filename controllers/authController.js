const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');
const { attachCookieToRespon, createTokenUser } = require('../utils');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const isFirstAccount = await User.countDocuments({});
  const role = isFirstAccount === 0 ? 'admin' : 'user';
  const user = await User.create({ name, email, password, role });
  const userInfo = createTokenUser(user);
  attachCookieToRespon(res, userInfo);
};

const logIn = async (req, res,next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new customError.BadRequestError('pleas provide email and password');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new customError.UnauthenticatedError('invalid credential');
  }
  const isCompare = await user.comparePassword(password);
  if (!isCompare) {
    throw new customError.UnauthenticatedError('password was not match');
  }
  attachCookieToRespon(res, createTokenUser(user));
};

const logOut = (req, res) => {
  res
    .cookie('token', 'logged out', {
      expires: new Date(Date.now() + 30 * 1000),
      httpOnly: true,
    })
    .status(StatusCodes.OK)
    .json({ msg: 'user logged out successfuly' });
};

module.exports = { register, logIn, logOut };
