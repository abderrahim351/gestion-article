// src/modules/articles/article.service.js
const { Article } = require("./article.model");

const createArticle = async ({ title, content, imageUrl, tags, authorId }) => {
  const article = await Article.create({
    title,
    content,
    imageUrl: imageUrl || null,
    tags: tags || [],
    author: authorId,
  });

  return article;
};

const getArticles = async ({ page = 1, limit = 10, tag, authorId }) => {
  const query = {};

  if (tag) {
    query.tags = tag.toLowerCase();
  }

  if (authorId) {
    query.author = authorId;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Article.find(query)
      .populate("author", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Article.countDocuments(query),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getArticleById = async (id) => {
  const article = await Article.findById(id).populate(
    "author",
    "name email role"
  );
  return article;
};

const updateArticle = async (id, data) => {
  const article = await Article.findByIdAndUpdate(
    id,
    {
      $set: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        tags: data.tags,
      },
    },
    { new: true }
  ).populate("author", "name email role");

  return article;
};

const deleteArticle = async (id) => {
  const article = await Article.findByIdAndDelete(id);
  return article;
};

module.exports = {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
