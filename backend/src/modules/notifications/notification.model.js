const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    type: {
      type: String,
      enum: ["NEW_COMMENT"],
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.articleId = ret.article?.toString?.() || ret.article;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = { Notification };
