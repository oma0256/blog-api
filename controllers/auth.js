const { validationResult } = require("express-validator");
const bycrpt = require("bcrypt");
const User = require("../models/users");
const { generateToken } = require("../utils/jwt");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Registration failed, please check the fields");
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
          .json({ message: "User registered successfully", userId: user._id }); // eslint-disable-line no-underscore-dangle
      });
    })
    .catch(err => next(err));
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Login failed, please check the fields");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { user } = req;
  delete user.password;
  const token = generateToken(user);
  return res
    .status(200)
    .json({ message: "Loggedin successfully", token, user });
};
