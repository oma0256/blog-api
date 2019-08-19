const { validationResult } = require("express-validator");
const {
  Types: { ObjectId }
} = require("mongoose");
const Post = require("../models/post");
const User = require("../models/users");

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
    user: { _id }
  } = req;
  const postData = { ...body, imageUrl: path, creator: _id };
  let createdPost;
  new Post(postData)
    .save()
    .then(post => {
      createdPost = post;
      return User.findById(_id);
    })
    .then(creator => {
      creator.posts.push(createdPost);
      return creator.save();
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
  if (currentPage) {
    const postsPerPage = 2;
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    return Post.find()
      .then(posts => {
        const paginatedPosts = posts.slice(start, end);
        return res.status(200).json({
          message: "Posts returned successfully",
          posts: paginatedPosts,
          totalItems: posts.length
        });
      })
      .catch(err => next(err));
  }
  return Post.find().then(posts =>
    res.status(200).json({ message: "Posts returned successfully", posts })
  );
};

exports.retrievePost = (req, res, next) => {
  const {
    params: { postId }
  } = req;
  Post.findById(ObjectId(postId))
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
    user: { _id }
  } = req;
  if (req.file) {
    body.imageUrl = req.file.path;
  }
  Post.findByIdAndUpdate(ObjectId(postId), body, {
    new: true,
    runValidators: true
  })
    .then(post => {
      if (!post) {
        const error = new Error("Post doesn't exist");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== _id.toString()) {
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
    user: { _id }
  } = req;
  Post.findByIdAndDelete(postId, { runValidators: true })
    .then(post => {
      if (!post) {
        const error = new Error("Post doesn't exist");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== _id.toString()) {
        const error = new Error("You are not the creator of this post");
        error.statusCode = 403;
        throw error;
      }
      return res.status(200).json({ message: "Post deleted successfully" });
    })
    .catch(err => next(err));
};
