// src/routes.js
const express = require("express");
const router = express.Router();

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
 const articleRoutes = require("./modules/articles/article.routes");
const commentRoutes = require("./modules/comments/comment.routes");
const notificationRoutes = require("./modules/notifications/notification.routes");
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
 router.use("/articles", articleRoutes);
router.use("/comments", commentRoutes); 
router.use("/notifications", notificationRoutes);
module.exports = router;
