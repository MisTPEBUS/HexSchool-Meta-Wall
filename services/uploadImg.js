const multer = require('multer');
const path = require('path');
const {appError} = require('../services/handleResponse');

const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, next) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      next(appError("檔案格式錯誤，僅限上傳 jpg、jpeg、png!",next));
    }
    next(null, true);
  },
}).any();

module.exports = upload;

