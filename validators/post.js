const { body } = require("express-validator");

exports.createPostValidators = [
  body("title")
    .exists()
    .withMessage("Title is required"),
  body("content")
    .exists()
    .withMessage("Content is required")
];
