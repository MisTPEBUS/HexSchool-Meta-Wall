const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, '名字 未填寫']
    }, 
   
    content: {
      type: String,
      required: [true, 'Content 未填寫']
    },
    userPhoto: {
      type: String,
      default: ""
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
    versionKey:false,
    strictPopulate:false
  }
);
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
