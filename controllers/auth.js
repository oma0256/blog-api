const { validationResult } = require("express-validator");
const bycrpt = require("bcrypt");
const User = require("../models/users");
const { generateToken } = require("../utils/jwt");
const { invalidInputs } = require("../messages/index");
const messages = require("../messages/controllers/auth");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(invalidInputs);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const saltRounds = 12;
  const {
    body: { password, ...userData }
  } = req;
  bycrpt
    .hash(password, saltRounds)
    .then(encryptedPassword => {
      userData.password = encryptedPassword;
      new User(userData).save().then(user => {
        return res
          .status(201)
          .json({ message: messages.userRegistered, userId: user._id });
      });
    })
    .catch(err => next(err));
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(invalidInputs);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { user } = req;
  const updatedUser = user.toObject();
  delete updatedUser.password;
  const token = generateToken(updatedUser);
  return res
    .status(200)
    .json({ message: messages.userLoggedIn, token, user: updatedUser });
};
