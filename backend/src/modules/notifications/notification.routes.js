const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth.middleware");
const notificationService = require("./notification.service");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const list = await notificationService.getUserNotificationsLast24h(userId);

    const payload = list.map((n) => ({
      id: n.id,
      articleId: n.article?._id?.toString() || n.articleId,
      articleTitle: n.article?.title || "Article",
      content: n.content,
      read: n.read,
      createdAt: n.createdAt,
    }));

    res.json(payload);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/read", authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notif = await notificationService.markAsRead(userId, req.params.id);

    if (!notif) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({
      id: notif.id,
      articleId: notif.article?._id?.toString() || notif.articleId,
      articleTitle: notif.article?.title || "Article",
      content: notif.content,
      read: notif.read,
      createdAt: notif.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
