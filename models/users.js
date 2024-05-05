const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '名字 未填寫']
    },
   
    sex: {
      type: String,
      enum:["maile", "female"]
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
      required: [true, '請輸入密碼'],
      minlength: 8,
      select: false
    },
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
