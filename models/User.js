const { func } = require('joi');
const mongoose = require('mongoose');
const Validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name must be provided'],
    minlength: [3, 'name must be atleast 3 character'],
    maxlength: [50, 'name cant be bigger than 50 character'],
  },
  email: {
    type: String,
    required: [true, 'email must be provided'],
    validate: {
      validator: Validator.isEmail,
      message: 'pleas provide a valim Email',
    },
    unique: [true, 'email already exists'],
  },
  password: {
    type: String,
    required: [true, 'email must be provided'],
    minlength: [8, 'password must be atleast 8 character'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

userSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
