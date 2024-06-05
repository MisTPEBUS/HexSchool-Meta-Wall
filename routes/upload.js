const express = require('express');
const router = express.Router();

const { Success, NotFound, appError } = require('../services/handleResponse.js');
const { handleErrorAsync } = require('../services/handleResponse.js');
const { isAuth,generateSendJWT } = require('../services/auth');
const { v4: uuidv4 } = require('uuid');
const upload = require('../services/uploadImg.js');
const multer = require('multer');
 




// 上傳圖片
 router.post('/',upload, isAuth,handleErrorAsync(async (req, res, next) =>{
  console.log(req.user);
  console.log(req.file);
  

})); 



module.exports = router;