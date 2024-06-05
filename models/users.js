const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '名字 未填寫']
    },
    photo: {
      type: String
    },
    sex: {
      type: String,
      enum: ["male", "female"],
      required: [true, '性別 未填寫']
    },
    email: {
      type: String,
      required: [true, 'Email 未填寫'],
      unique: true,
      lowercase: true,
      select: false
    },
    password: {
      type: String,
      required: [true, '密碼 未填寫'],
      minlength: 8,
      select: false
    },
    followers: [
      {
        email: {
          type: String,
          ref: 'User'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
  }, {
  versionKey: false,

}
);
const User = mongoose.model('User', userSchema);

module.exports = User;
