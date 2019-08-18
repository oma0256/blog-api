const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Failed to create post, please check the inputs");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const {
    body,
    file: { path },
    user: { _id },
    user
  } = req;
  const postData = { ...body, image: path, creator: _id };
  let createdPost;
  new Post(postData)
    .save()
    .then(post => {
      createdPost = post;
      user.posts.push(post);
      return user.save();
    })
    .then(creator => {
      return res.status(201).json({
        message: "Post created successfully",
        post: createdPost,
        creator
      });
    })
    .catch(err => next(err));
};

exports.retrievePosts = (req, res, next) => {
  const currentPage = req.query.page;
  const postsPerPage = 2;
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  Post.find()
    .then(posts => {
      const paginatedPosts = posts.slice(start, end);
      return res.status(200).json({
        message: "Posts returned successfully",
        posts: paginatedPosts,
        totalItems: posts.length
      });
    })
    .catch(err => next(err));
};

exports.retrievePost = (req, res, next) => {
  const {
    params: { postId }
  } = req;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
      return res
        .status(200)
        .json({ message: "Post returned successfully", post });
    })
    .catch(err => next(err));
};

exports.updatePost = (req, res, next) => {
  const {
    params: { postId },
    body,
    user
  } = req;
  Post.findOneAndUpdate({ _id: postId }, body, { new: true })
    .then(post => {
      if (!post) {
        const error = new Error("Post doesn't exist");
        error.statusCode = 404;
        throw error;
      }
      // eslint-disable-next-line no-underscore-dangle
      if (post.creator.toString() !== user._id.toString()) {
        const error = new Error("You are not the creator of this post");
        error.statusCode = 403;
        throw error;
      }
      return res
        .status(200)
        .json({ message: "Post updated successfully", post });
    })
    .catch(err => next(err));
};

exports.deletePost = (req, res, next) => {
  const {
    params: { postId },
    user
  } = req;
  Post.findOneAndDelete({ _id: postId })
    .then(post => {
      if (!post) {
        const error = new Error("Post doesn't exist");
        error.statusCode = 404;
        throw error;
      }
      // eslint-disable-next-line no-underscore-dangle
      if (post.creator.toString() !== user._id.toString()) {
        const error = new Error("You are not the creator of this post");
        error.statusCode = 403;
        throw error;
      }
      return res.status(200).json({ message: "Post deleted successfully" });
    })
    .catch(err => next(err));
};
