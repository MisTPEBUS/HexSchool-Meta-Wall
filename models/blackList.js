const mongoose = require('mongoose');
const blackListSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1d'
  }
}, {
  versionKey: false,
});
// BlackList
const BlackList = mongoose.model('blackList', blackListSchema);
module.exports = BlackList;