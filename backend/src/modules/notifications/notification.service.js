const { Notification } = require("./notification.model");

const createNotification = async ({ userId, articleId, content }) => {
  const notification = await Notification.create({
    user: userId,
    article: articleId,
    type: "NEW_COMMENT",
    content,
  });
  return notification;
};

const getUserNotificationsLast24h = async (userId) => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000); 
  return Notification.find({
    user: userId,
    createdAt: { $gte: since },
  })
    .sort({ createdAt: -1 })
    .populate("article", "title");
};

const markAsRead = async (userId, notificationId) => {
  const notif = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  ).populate("article", "title");

  return notif;
};

module.exports = {
  createNotification,
  getUserNotificationsLast24h,
  markAsRead,
};
