// src/modules/articles/article.model.js
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

articleSchema.index({ createdAt: -1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ author: 1 });

const Article = mongoose.model("Article", articleSchema);

module.exports = {
  Article,
};
