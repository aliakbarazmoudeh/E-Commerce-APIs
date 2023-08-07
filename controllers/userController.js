const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');
const User = require('../models/User');
const {
  attachCookieToRespon,
  createTokenUser,
  checkPermissions,
} = require('../utils');

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select('-password');
  if (!user) {
    throw new customError.NotFoundError(
      `cant find any user with this Id : ${req.params.id}`
    );
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    console.log('hello barbie');
    throw new customError.BadRequestError(
      'both of name and email must be provided'
    );
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { name, email },
    { new: true, runValidators: true }
  );
  attachCookieToRespon(res, createTokenUser(user));
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new customError.BadRequestError(
      'pleas provide a value for both of them'
    );
  }
  const user = await User.findById(req.user.userId);
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new customError.UnauthenticatedError("password doesn't match");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Success, Password Updated.' });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
