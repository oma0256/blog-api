const { body } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/users");

const authValidators = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail()
];

exports.signupValidators = [
  ...authValidators,
  body("email").custom(email => {
    User.findOne({ email }).then(user => {
      if (user) {
        throw new Error("User exists with this email address");
      }
      return true;
    });
  })
];

exports.loginValidators = [
  ...authValidators,
  body("email").custom((email, { req }) => {
    let loginUser;
    User.findOne({ email })
      .then(user => {
        if (!user) {
          throw new Error("User with this email is not registered");
        }
        loginUser = user;
        return bcrypt.compare(req.body.password, user.password);
      })
      .then(passwordsMatch => {
        if (!passwordsMatch) {
          throw new Error("Invalid credentials");
        }
        req.user = loginUser;
        return true;
      });
  })
];
