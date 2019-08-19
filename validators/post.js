const { body } = require("express-validator");
const messages = require("../messages/validators/post");

exports.createPostValidators = [
  body("title")
    .exists()
    .withMessage(messages.titleRequired)
    .trim()
    .custom(title => {
      if (!title) {
        throw new Error(messages.emptyTitle);
      }
      return true;
    }),
  body("content")
    .exists()
    .withMessage(messages.contentRequired)
    .trim()
    .custom(content => {
      if (!content) {
        throw new Error(messages.emptyContent);
      }
      return true;
    }),
  body("image").custom((image, { req }) => {
    if (!req.file) {
      throw new Error(messages.imageRequired);
    }
    return true;
  })
];
