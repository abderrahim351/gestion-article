// src/modules/comments/comment.model.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);

// Optimisation
commentSchema.index({ article: 1, createdAt: 1 });
commentSchema.index({ parentComment: 1 });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment };
