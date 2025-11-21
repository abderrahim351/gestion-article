// src/modules/comments/comment.service.js
const { Comment } = require("./comment.model");
const { Article } = require("../articles/article.model");

const createComment = async ({ articleId, authorId, content, parentCommentId }) => {
  const article = await Article.findById(articleId).populate("author", "name email");
  if (!article) {
    const err = new Error("Article not found");
    err.status = 404;
    throw err;
  }

  if (parentCommentId) {
    const parent = await Comment.findById(parentCommentId);
    if (!parent || parent.article.toString() !== articleId) {
      const err = new Error("Invalid parent comment");
      err.status = 400;
      throw err;
    }
  }

  const comment = await Comment.create({
    article: articleId,
    author: authorId,
    content,
    parentComment: parentCommentId || null,
  });

  const populated = await Comment.findById(comment._id)
    .populate("author", "name email")
    .populate("article", "title");

  return { comment: populated, article };
};

const getCommentsByArticle = async (articleId) => {
  const comments = await Comment.find({ article: articleId })
    .populate("author", "name email")
    .sort({ createdAt: 1 });

  const map = {};
  const roots = [];

  const formatted = comments.map((c) => {
    const obj = {
      id: c._id.toString(),
      content: c.content,
      author: c.author,
      article: c.article,
      parentComment: c.parentComment ? c.parentComment.toString() : null,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      replies: [],
    };
    map[obj.id] = obj;
    return obj;
  });

  formatted.forEach((c) => {
    if (c.parentComment) {
      const parent = map[c.parentComment];
      if (parent) {
        parent.replies.push(c);
      }
    } else {
      roots.push(c);
    }
  });

  return roots;
};

module.exports = {
  createComment,
  getCommentsByArticle,
};
