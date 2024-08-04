const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      select: false,
      required: [true, "UserID 未填寫"],
    },
    content: {
      type: String,
      required: [true, "Content 未填寫"],
    },
    userPhoto: {
      type: String,
      default: "",
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    tags: [{ type: String }],
    image: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,

    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id'
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
