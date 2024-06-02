const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/users.js');
const { Success, NotFound, appError } = require('../services/handleResponse.js');
const { handleErrorAsync } = require('../services/handleResponse.js');
const { isAuth, generateSendJWT } = require('../services/auth');
const BlackList = require('../models/blackList.js');


//註冊
router.post('/sign_up', handleErrorAsync(async (req, res, next) => {

  let { name, email, photo, sex, password } = req.body;
  if (!name || !email || !sex || !password) {
    return next(appError("傳入格式異常!請查閱API文件", next));
  }
  // Content cannot null
  if (!email.trim()) {
    return next(appError("Email欄位不能為空值！", next));
  }
  if (!password.trim()) {
    return next(appError("Password欄位不能為空值！", next));
  }
  if (!validator.isLength(password, { min: 8 })) {
    return next(appError("Password至少要8碼！", next));
  }
  if (!name.trim()) {
    return next(appError("Name欄位不能為空值！", next));
  }
  if (!sex.trim()) {
    return next(appError("性別欄位不能為空值！", next));
  }
  // isEmail Type
  if (!validator.isEmail(email)) {
    return next(appError("Email 格式不正確", next));
  }
  // find user

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return next(appError("使用者已經註冊", next, 409));
  }
  // pwd salt

  password = bcrypt.hash(password, 12);
  // 加密密碼
  password = await bcrypt.hash(req.body.password, 12);
  try {
    const newUser = await User.create({
      name,
      email,
      photo,
      sex,
      password
    });
    generateSendJWT(newUser, 201, res);
  }
  catch (err) { return next(appError(err.message, next)); }
  /*
      #swagger.tags =  ['使用者登入驗證']
      #swagger.path = '/v1/api/sign_up'
      #swagger.method = 'post'
      #swagger.summary='會員註冊'
      #swagger.description = '會員註冊'
      #swagger.produces = ["application/json"] 
    */
  /*
 #swagger.requestBody = {
             required: true,
             description:"會員資料",
             content: {
                 "application/json": {
                 schema: {
                     type: "object",
                     properties: {
                         name: {
                             type: "string",
                              example: "Lobinda"
                         },
                          email: {
                             type: "string",
                              example: "Lobinda123@test.com"
                         },
                          photo: {
                             type: "string",
                              example: "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA"
                         },
                          sex: {
                             type: "string",
                              enum:["male", "female"],
                              example: "male"
                         },
                          password: {
                             type: "string",
                             description: "至少要8碼",
                              example: "1q2w3e4r"
                         },
                     },
                     required: ["name", "email", "sex", "password"]
                 }  
             }
             }
         } 
 
  }
  #swagger.responses[201] = { 
    schema: {
        "status": "true",
        "data": {
             "user": {
                 "token": "eyJhbGciOiJ..........mDWPvJZSxu98W4",
                 "name": "Lobinda"
             }
        }
      }
    } 
  #swagger.responses[400] = { 
    schema: {
        "status": false,
        "message": "Error Msg",
      }
    } 
 */

  }));

//登入
router.post('/sign_in', handleErrorAsync(async (req, res, next) => {

  let { email, password } = req.body;
  if (!email || !password) {
    return next(appError("傳入格式異常!請查閱API文件", next));
  }
  // Content cannot null

  if (!email.trim() || !validator.isEmail(email)) {
    return next(appError("Email欄位格式異常！", next));
  }
  if (!password.trim()) {
    return next(appError("Password欄位不能為空值！", next));
  }


  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(appError("使用者未註冊!", next));
  }

  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    return next(appError('帳號密碼錯誤!', next));
  }
  generateSendJWT(user, 200, res);

  /*
    #swagger.tags =  ['使用者登入驗證']
    #swagger.path = '/v1/api/sign_in'
    #swagger.method = 'post'
    #swagger.summary='會員登入'
    #swagger.description = '會員登入'
    #swagger.produces = ["application/json"] 
  */
  /*
 #swagger.requestBody = {
             required: true,
             content: {
                 "application/json": {
                 schema: {
                     type: "object",
                     properties: {
                          email: {
                             type: "string",
                              example: "Lobinda123@test.com"
                         },
                          password: {
                             type: "string",
                             example: "1q2w3e4r"
                         },
                     },
                     required: ["email", "password"]
                 }  
             }
             }
         } 
 
  }
  #swagger.responses[200] = { 
    schema: {
        "status": "true",
        "data": {
             "user": {
                 "token": "eyJhbGciOiJ..........mDWPvJZSxu98W4",
                 "name": "Lobinda"
             }
        }
      }
    } 
  #swagger.responses[400] = { 
    schema: {
        "status": false,
        "message": "Error Msg",
      }
    } 
 */

  }));


//更新密碼
router.patch('/user/updatePassword', isAuth, handleErrorAsync(async (req, res, next) => {

  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return next(appError("傳入格式異常!請查閱API文件", next));
  }

  if (!password.trim()) {
    return next(appError("password不得為空值!", next));
  }
  if (!confirmPassword.trim()) {
    return next(appError("confirmPassword不得為空值!", next));
  }

  if (!validator.isLength(password, { min: 8 })) {
    return next(appError("密碼至少8碼", next));
  }

  if (password !== confirmPassword) {
    return next(appError("密碼不一致！", next));
  }

  // 將新密碼加密
  newPwd = await bcrypt.hash(password, 12);

  // 更新資料庫
  const user = await User.findByIdAndUpdate(req.user.id, {
    password: newPwd
  });

  // JWT
  generateSendJWT(user, 200, res);

  /*
      #swagger.tags =  ['使用者登入驗證']
      #swagger.path = '/v1/api/user/updatePassword'
      #swagger.method = 'patch'
      #swagger.summary='更新密碼'
      #swagger.description = '更新密碼'
      #swagger.produces = ["application/json"] 
      #swagger.security = [{
        "bearerAuth": []
    }]
    */
  /*
 #swagger.requestBody = {
             required: true,
             content: {
                 "application/json": {
                 schema: {
                     type: "object",
                     properties: {
                          password: {
                             type: "string",
                             description: "至少要8碼",
                             example: "1q2w3e4r"
                         },
                         confirmPassword: {
                             type: "string",
                             description: "至少要8碼",
                             example: "1q2w3e4r"
                         },
                     },
                     required: [ "password", "confirmPassword"]
                 }  
             }
             }
         } 
 
  }
  #swagger.responses[200] = { 
    schema: {
        "status": "true",
        "data": {
             "user": {
                 "token": "eyJhbGciOiJ..........mDWPvJZSxu98W4",
                 "name": "Lobinda"
             }
        }
      }
    } 
  #swagger.responses[400] = { 
    schema: {
        "status": false,
        "message": "Error Msg",
      }
    } 
 */

}));

//登出
router.post('/sign_out', isAuth, handleErrorAsync(async (req, res, next) => {


  const hasBlackList = await BlackList.findOne({ token: req.user._id });

  if (hasBlackList) {
    return next(appError("使用者已經登出", next));
  }
  await BlackList
    .create({
      token: req.user._id
    });
  Success(res, "會員登出");


  /*
      #swagger.tags =  ['使用者登入驗證']
      #swagger.path = '/v1/api/sign_out'
      #swagger.method = 'post'
      #swagger.summary='會員登出'
      #swagger.description = '會員登出'
      #swagger.produces = ["application/json"] 
      #swagger.security = [{
        "bearerAuth": []
    }]
    */
  /*
  
  #swagger.responses[200] = { 
    schema: {
        "status": "true",
        "message": "會員登出",
        "data": {
             }
        }
      }
    } 
  #swagger.responses[400] = { 
    schema: {
        "status": false,
        "message": "Error Msg",
      }
    } 
 */


}));

//查詢個人資料
router.get('/user/profile', isAuth, handleErrorAsync(async (req, res, next) => {
  const { id } = req.user;
  const userToSearch = await User.findById(id);
  if (!userToSearch) {
    return next(appError("使用者資料讀取異常，請重新登錄！", next));
  }
  Success(res, "", userToSearch);

  /*
       #swagger.tags =  ['使用者登入驗證']
       #swagger.path = '/v1/api/user/profile'
       #swagger.method = 'get'
       #swagger.summary='查詢個人資料'
       #swagger.description = '查詢個人資料'
       #swagger.produces = ["application/json"] 
       #swagger.security = [{
         "bearerAuth": []
     }]
     */
  /*
  #swagger.responses[200] = { 
    schema: {
       "success": true,
       "message": "",
        "data": {
          "_id": "665c618fa2685f9b9e4c79fe",
          "name": "Lobinda",
          "photo": "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA",
          "sex": "male",
          "followers": []
        }
      }
    } 
  #swagger.responses[400] = { 
    schema: {
        "status": false,
        "message": "Error Msg",
      }
    } 
 */

}));

//修改個人資料
router.patch('/user/profile', isAuth, handleErrorAsync(async (req, res, next) => {
  const { id } = req.user;
  let { name, photo, sex } = req.body;

  if (!name || !photo || !sex) {
    return next(appError("傳入格式異常!請查閱API文件", next));
  }
  // Content cannot null

  if (!name.trim()) {
    return next(appError("Name欄位不能為空值！", next));
  }

  if (!sex.trim()) {
    return next(appError("性別欄位不能為空值！", next));
  }

  const updateToUser = await User.findByIdAndUpdate(
    { _id: id },
    req.body,
    { new: true });
  if (!updateToUser) {
    return next(appError(404, `此ID:${id}不存在!`, next));
  }

  Success(res, `已修改個人資料!`, updateToUser, 200);

  /*
      #swagger.tags =  ['使用者登入驗證']
      #swagger.path = '/v1/api/user/profile'
      #swagger.method = 'patch'
      #swagger.summary='查詢個人資料'
      #swagger.description = '查詢個人資料'
      #swagger.produces = ["application/json"] 
      #swagger.security = [{
        "bearerAuth": []
    }]
    */
  /*
     #swagger.requestBody = {
             required: true,
             description:"會員資料",
             content: {
                 "application/json": {
                 schema: {
                     type: "object",
                     properties: {
                         name: {
                             type: "string",
                              example: "Lobinda"
                         },
                          email: {
                             type: "string",
                              example: "Lobinda123@test.com"
                         },
                          photo: {
                             type: "string",
                              example: "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA"
                         },
                          sex: {
                             type: "string",
                              enum:["male", "female"],
                              example: "male"
                         },
                        
                     },
                     
                 }  
             }
             }
         } 
 
  }

  #swagger.responses[200] = { 
    schema: {
       "success": true,
       "message": "已修改個人資料!",
        "data": {
          "_id": "665c618fa2685f9b9e4c79fe",
          "name": "Lobinda",
          "photo": "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA",
          "sex": "male",
          "followers": []
        }
      }
    } 
  #swagger.responses[400] = { 
    schema: {
        "status": false,
        "message": "Error Msg",
      }
    } 
 */


}));




module.exports = router;
