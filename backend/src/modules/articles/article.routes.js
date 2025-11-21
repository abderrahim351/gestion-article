const express = require("express");
const router = express.Router();
const articleController = require("./article.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { permit } = require("../../middlewares/role.middleware");
const { uploadArticleImage } = require("../../config/multer");

router.get("/", articleController.getAllArticles);
router.get("/:id", articleController.getArticle);

router.post(
  "/",
  authenticate,
  permit("ADMIN", "EDITOR", "WRITER"),
  uploadArticleImage.single("image"),
  articleController.createArticle
);

router.patch(
  "/:id",
  authenticate,
  permit("ADMIN", "EDITOR", "WRITER"),
  uploadArticleImage.single("image"), 
  articleController.updateArticle
);

router.delete(
  "/:id",
  authenticate,
  permit("ADMIN"),
  articleController.deleteArticle
);

module.exports = router;
