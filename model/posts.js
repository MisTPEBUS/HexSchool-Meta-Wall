const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, '貼文姓名未填寫'],
      unique: true
    },

    userPhoto: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      required: [true, 'Content 未填寫']
    },
    image: {
      type: String,
      default: ""
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },{
    versionKey:false
  }
);
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
