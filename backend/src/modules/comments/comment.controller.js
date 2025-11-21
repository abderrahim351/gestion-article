// src/modules/comments/comment.controller.js
const commentService = require("./comment.service");
const notificationService = require("../notifications/notification.service");

const createComment = async (req, res, next) => {
  try {
    const { articleId, content, parentCommentId } = req.body;

    if (!articleId || !content) {
      return res
        .status(400)
        .json({ message: "articleId and content are required" });
    }

    const { comment, article } = await commentService.createComment({
      articleId,
      authorId: req.user.id,
      content,
      parentCommentId,
    });

    let notification = null;
    if (article.author && article.author._id) {
      notification = await notificationService.createNotification({
        userId: article.author._id.toString(),
        articleId: article._id.toString(),
        content: comment.content,
      });
    }

    const io = req.app.get("io");

    const payload = {
      type: "NEW_COMMENT",
      articleId: article._id.toString(),
      articleTitle: article.title,
      comment: {
        id: comment._id.toString(),
        content: comment.content,
        author: comment.author,
        createdAt: comment.createdAt,
        parentComment: comment.parentComment,
      },
      notificationId: notification ? notification.id : null,
    };

    if (io && article.author && article.author._id) {
      io.to(article.author._id.toString()).emit("notification:new-comment", payload);
    } else if (io) {
      io.emit("notification:new-comment", payload);
    }

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

const getCommentsForArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;

    const commentsTree = await commentService.getCommentsByArticle(articleId);
    res.json(commentsTree);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createComment,
  getCommentsForArticle,
};
