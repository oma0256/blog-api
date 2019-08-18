const { body } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/users");
const messages = require("../messages/validators/auth");

const authValidators = [
  body("email")
    .exists()
    .withMessage(messages.emailRequired)
    .trim()
    .isEmail()
    .withMessage(messages.invalidEmail)
    .normalizeEmail(),
  body("password")
    .exists()
    .withMessage(messages.passwordRequired)
    .trim()
];

exports.signupValidators = [
  ...authValidators,
  body("email").custom(email => {
    return User.findOne({ email }).then(user => {
      if (user) {
        throw new Error(messages.duplicateUser);
      }
      return true;
    });
  }),
  body("password")
    .isLength({ min: 5 })
    .withMessage(messages.shortPassword),
  body("username")
    .exists()
    .withMessage(messages.usernameRequired)
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage(messages.usernameLength)
    .isAlphanumeric()
    .withMessage(messages.alphanumericUsername)
];

exports.loginValidators = [
  ...authValidators,
  body("email").custom((email, { req }) => {
    let loginUser;
    return User.findOne({ email })
      .then(user => {
        if (!user) {
          throw new Error(messages.invalidCredentials);
        }
        loginUser = user;
        return bcrypt.compare(req.body.password, user.password);
      })
      .then(passwordsMatch => {
        if (!passwordsMatch) {
          throw new Error(messages.invalidCredentials);
        }
        req.user = loginUser;
        return true;
      });
  })
];
