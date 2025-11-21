// src/modules/comments/comment.routes.js
const express = require("express");
const router = express.Router();
const commentController = require("./comment.controller");
const { authenticate } = require("../../middlewares/auth.middleware");

router.post("/", authenticate, commentController.createComment);

router.get("/article/:articleId", commentController.getCommentsForArticle);

module.exports = router;
