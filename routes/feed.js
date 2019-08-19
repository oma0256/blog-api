const express = require("express");
const feedController = require("../controllers/feed");
const upload = require("../utils/handle-image-upload");
const { checkUserIsAuthenticated } = require("../utils/jwt");
const { createPostValidators } = require("../validators/post");

const router = express.Router();

router.get("/posts", checkUserIsAuthenticated, feedController.retrievePosts);
router.get(
  "/posts/:postId",
  checkUserIsAuthenticated,
  feedController.retrievePost
);
router.post(
  "/posts",
  checkUserIsAuthenticated,
  upload.single("image"),
  createPostValidators,
  feedController.createPost
);
router.put(
  "/posts/:postId",
  checkUserIsAuthenticated,
  upload.single("image"),
  feedController.updatePost
);

module.exports = router;
