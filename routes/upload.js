const express = require('express');
const router = express.Router();

const { Success, NotFound, appError } = require('../services/handleResponse.js');
const { handleErrorAsync } = require('../services/handleResponse.js');
const { isAuth,generateSendJWT } = require('../services/auth');
const { v4: uuidv4 } = require('uuid');
/* const upload = require('../service/uploadImages'); */
const firebaseAdmin = require('../services/firebase.js');

const bucket = firebaseAdmin.storage().bucket(); 


// 上傳圖片
router.post('/', isAuth,handleErrorAsync(async (req, res, next) =>{
    if (!req.files.length) {
        return next(appError("尚未上傳檔案", next));
      }
      
      const file = req.files[0];
      
      const blob = bucket.file(`images/${uuidv4()}.${file.originalname.split('.').pop()}`);
      
      const blobStream = blob.createWriteStream();
    
      blobStream.end(file.buffer);

      blobStream.on('finish', () => {
        // 設定檔案的存取權限
        const config = {
          action: 'read', // 權限
          expires: '12-31-2500', // 網址的有效期限
        };
        
        // 取得檔案的網址
        blob.getSignedUrl(config, (err, fileUrl) => {
          res.send({
            fileUrl
          });
        });
      });
    
      blobStream.on('error', (err) => {
        res.status(500).send('上傳失敗');
      });
    
      blobStream.end(file.buffer);

}));



module.exports = router;