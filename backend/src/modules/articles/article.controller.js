// src/modules/articles/article.controller.js
const articleService = require("./article.service");
const { Article } = require("./article.model");

const createArticle = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "title and content are required" });
    }

    let imageUrl = null;
    if (req.file) {
     
      imageUrl = `/uploads/articles/${req.file.filename}`;
    }

    const parsedTags =
      typeof tags === "string"
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : Array.isArray(tags)
        ? tags
        : [];

    const article = await articleService.createArticle({
      title,
      content,
      imageUrl,
      tags: parsedTags,
      authorId: req.user.id,
    });

    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

const getAllArticles = async (req, res, next) => {
  try {
    const { page, limit, tag, authorId } = req.query;

    const result = await articleService.getArticles({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      tag,
      authorId,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getArticle = async (req, res, next) => {
  try {
    const article = await articleService.getArticleById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (err) {
    next(err);
  }
};

const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user.id;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const isAdminOrEditor = ["ADMIN", "EDITOR"].includes(userRole);

    if (!isAdminOrEditor) {
      if (userRole !== "WRITER") {
        return res
          .status(403)
          .json({ message: "Forbidden: role cannot edit articles" });
      }

      if (article.author.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "Forbidden: you can edit only your articles" });
      }
    }

    const { title, content, tags } = req.body;

    const parsedTags =
      typeof tags === "string"
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : Array.isArray(tags)
        ? tags
        : undefined;

    let imageUrl;
    if (req.file) {
      imageUrl = `/uploads/articles/${req.file.filename}`;
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (parsedTags !== undefined) updateData.tags = parsedTags;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const updated = await articleService.updateArticle(id, updateData);

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await articleService.deleteArticle(id);

    if (!deleted) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json({ message: "Article deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticle,
  updateArticle,
  deleteArticle,
};
