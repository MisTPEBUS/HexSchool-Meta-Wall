const express = require('express');
const router = express.Router();
const Post = require("../models/posts");
const resHandler = require("../services/handleResponse");
const mongoose = require('mongoose');
const { Success, NotFound, appError } = require('../services/handleResponse.js');
const { handleErrorAsync } = require('../services/handleResponse.js');
const { isAuth } = require('../services/auth');

//查詢全部貼文
router.get('/', handleErrorAsync(async (req, res, next) => {
    const { timeSort, keyWord } = req.query;
    const { user } = req.body
    //設定排序為時間近到遠還是遠道近(預設時間近期貼文)
    const tSort = timeSort == "asc" ? "createdAt" : "-createdAt"
    let query = {};
    //關鍵字針對Model中userName + content 搜尋
    if (keyWord) {
        query.$or = [
            { content: new RegExp(keyWord, 'i') },
            { user: { $in: user } },
        ];
    }
    const posts = await Post.find(query).populate('User').sort(tSort);
    Success(res, "", posts);

    /*
   #swagger.tags =  ['貼文牆管理']
   #swagger.path = '/v1/api/posts'
   #swagger.method = 'get'
   #swagger.summary='查詢全部貼文'
   #swagger.description = '查詢全部貼文'
   #swagger.produces = ["application/json"] 
 */
    /*
   
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

//查詢個人全部貼文
router.get('/personal', isAuth, handleErrorAsync(async (req, res, next) => {
    const { id } = req.user;
    const { timeSort, keyWord } = req.query;
    const { user } = req.body
    //設定排序為時間近到遠還是遠道近(預設時間近期貼文)
    const tSort = timeSort == "asc" ? "createdAt" : "-createdAt"
    let query = {
        user: id
    };
    //關鍵字針對Model中userName + content 搜尋
    if (keyWord) {
        query.$or = [
            { content: new RegExp(keyWord, 'i') },
            { user: { $in: user } },
        ];
    }
    const posts = await Post.find(query).populate('User').sort(tSort);
    Success(res, "", posts);


    /*
     #swagger.tags =  ['貼文牆管理']
     #swagger.path = '/v1/api/posts/personal'
     #swagger.method = 'get'
     #swagger.summary='查詢個人全部貼文'
     #swagger.description = '查詢個人全部貼文'
     #swagger.produces = ["application/json"] 
     #swagger.security = [{
       "bearerAuth": []
   }]
   */
    /* 
  
    #swagger.responses[200] = { 
      schema: {
          "success": true,
          "message": "已建立貼文",
          "data": [
                {
                    "_id": "665c9c9302804f1d51677e48",
                    "content": "這是第一條訊息~HI",
                    "userPhoto": "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA",
                    "likes": [],
                    "tags": [
                        "美食"
                    ],
                    "image": "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA",
                    "createdAt": "2024-06-02T16:23:47.132Z"
                },
                {
                    "_id": "665c94061280af722184b565",
                    "content": "這是第一條訊息",
                    "userPhoto": "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA",
                    "likes": [],
                    "tags": [
                        "美食"
                    ],
                    "image": "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA",
                    "createdAt": "2024-06-02T15:47:18.351Z"
                },
                {
                    "_id": "665c93a755a500762b17d3e6",
                    "content": "這是第一條訊息",
                    "userPhoto": "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA",
                    "likes": [],
                    "tags": [
                        "美食"
                    ],
                    "image": "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA",
                    "createdAt": "2024-06-02T15:45:43.913Z"
                }
            ]
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

//查詢單一貼文
router.get('/:id', isAuth, handleErrorAsync(async (req, res, next) => {
    const { id } = req.params;

    if(!id){
        return next(appError("傳入格式異常!請查閱API文件", next));
    }

    if (!id.trim() || !mongoose.Types.ObjectId.isValid(id)) {
        return next(appError('id格式異常，請重新確認!', next));
    }
    const postToSearch = await Post.findById(id);
    if (!postToSearch) {
        return next(NotFound(`此貼文ID:${id}不存在!`, next));
    }
    Success(res, '', postToSearch);

     /*
     #swagger.tags =  ['貼文牆管理']
     #swagger.path = '/v1/api/posts/{id}'
     #swagger.method = 'get'
     #swagger.summary='查詢單一貼文'
     #swagger.description = '查詢單一貼文'
     #swagger.produces = ["application/json"] 
     #swagger.security = [{
       "bearerAuth": []
   }]
   */
    /* 
   
    #swagger.responses[200] = { 
      schema: {
          "success": true,
          "message": "已建立貼文",
          "data": {
            "user": "665c618fa2685f9b9e4c79fe",
            "content": "這是第一條訊息",
            "userPhoto": "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA",
            "likes": [],
            "tags": [
                "美食"
            ],
            "image": "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA",
            "_id": "665c93a755a500762b17d3e6",
            "createdAt": "2024-06-02T15:45:43.913Z"
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

//新增貼文
router.post('/', isAuth, handleErrorAsync(async (req, res, next) => {
    const { content } = req.body;
    const { id } = req.user;

    if (!content) {
        return next(appError("傳入格式異常!請查閱API文件", next));
    }

    if (!content.trim()) {
        return next(appError('Content不能為空值!', next));

    }
    let addParams = { ...req.body };
    addParams.user = id;
    const newPost = await Post.create(addParams);

    Success(res, "已建立貼文", newPost, 201);

    /*
     #swagger.tags =  ['貼文牆管理']
     #swagger.path = '/v1/api/posts'
     #swagger.method = 'post'
     #swagger.summary='新增貼文'
     #swagger.description = '新增貼文'
     #swagger.produces = ["application/json"] 
     #swagger.security = [{
       "bearerAuth": []
   }]
   */
    /* 
   #swagger.requestBody = {
               required: true,
               description:"貼文牆",
               content: {
                   "application/json": {
                   schema: {
                       type: "object",
                       properties: {
                           content: {
                               type: "string",
                                example: "這是第一條訊息"
                           },
                            userPhoto: {
                               type: "string",
                                example: "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA"
                           },
                            tags: {
                               type: "array",
                               items: {
                                      type: "string"
                               },
                               example: "美食"
                           },
                            image: {
                               type: "string",
                                example: "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA"
                           },
                       },
                       required: ["content"]
                   }  
               }
               }
           } 
   
    }
    #swagger.responses[201] = { 
      schema: {
          "success": true,
          "message": "已建立貼文",
          "data": {
      "user": "665c618fa2685f9b9e4c79fe",
      "content": "這是第一條訊息",
      "userPhoto": "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA",
      "likes": [],
      "tags": [
        "美食"
      ],
      "image": "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA",
      "_id": "665c93a755a500762b17d3e6",
      "createdAt": "2024-06-02T15:45:43.913Z"
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

//更新貼文
router.patch('/:id', isAuth, handleErrorAsync(async (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!id || !content) {
        return next(appError("傳入格式異常!請查閱API文件", next));
    }

    if (!content.trim()) {
        return next(appError('Content不得為空值!', next));
    }
    if (!id.trim() || !mongoose.Types.ObjectId.isValid(id)) {
        return next(appError('id格式異常，請重新確認!', next));
    }
    const postToUpdate
        = await Post.
            findByIdAndUpdate(
                { _id: id },
                req.body,
                { new: true });
    if (!postToUpdate) {
        return next(appError( `此貼文ID:${id}不存在!`, next));
    }

    Success(res, `已修改貼文!`, postToUpdate, 200);

    /*
     #swagger.tags =  ['貼文牆管理']
     #swagger.path = '/v1/api/posts/{id}'
     #swagger.method = 'patch'
     #swagger.summary='更新貼文'
     #swagger.description = '更新貼文'
     #swagger.produces = ["application/json"] 
     #swagger.security = [{
       "bearerAuth": []
   }]
   */
    /*  #swagger.parameters['id'] = {
         in: 'path',
         type: 'string',
         required: true,
         description: '貼文ID'
     } */

    /* 
   #swagger.requestBody = {
               required: true,
               description:"貼文牆",
               content: {
                   "application/json": {
                   schema: {
                       type: "object",
                       properties: {
                           content: {
                               type: "string",
                                example: "這是第一條訊息"
                           },
                            userPhoto: {
                               type: "string",
                                example: "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA"
                           },
                            tags: {
                               type: "array",
                               items: {
                                      type: "string"
                               },
                               example: "美食"
                           },
                            image: {
                               type: "string",
                                example: "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA"
                           },
                       },
                       required: ["content"]
                   }  
               }
               }
           } 
   
    }
    #swagger.responses[201] = { 
      schema: {
          "success": true,
          "message": "已建立貼文",
          "data": {
      "user": "665c618fa2685f9b9e4c79fe",
      "content": "這是第一條訊息",
      "userPhoto": "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA",
      "likes": [],
      "tags": [
        "美食"
      ],
      "image": "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-holding-a-cell-phone-3D0Jxa1QSVA",
      "_id": "665c93a755a500762b17d3e6",
      "createdAt": "2024-06-02T15:45:43.913Z"
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

//刪除文章
router.delete('/:id', isAuth, handleErrorAsync(async (req, res, next) => {
    // query params
    const { id } = req.params;

    if(!id)
    {
        return next(appError("傳入格式異常!請查閱API文件", next));
    }

    if (!id.trim() || !mongoose.Types.ObjectId.isValid(id)) {
        return next(appError('id格式異常，請重新確認!', next));
    }

    const postToDelete = await Post.findByIdAndDelete(
        { _id: id },
        { new: true }  // 更新
    );

    if (!postToDelete) {
        return next(NotFound(`此貼文ID:${id}不存在!`, next));
    }

    Success(res, `貼文ID:${id} 已刪除!`);

     /*
     #swagger.tags =  ['貼文牆管理']
     #swagger.path = '/v1/api/posts/{id}'
     #swagger.method = 'delete'
     #swagger.summary='刪除文章'
     #swagger.description = '刪除文章'
     #swagger.produces = ["application/json"] 
     #swagger.security = [{
       "bearerAuth": []
   }]
   */
    /*  #swagger.parameters['id'] = {
         in: 'path',
         type: 'string',
         required: true,
         description: '貼文ID'
     } */

    /* 
  
    #swagger.responses[200] = { 
      schema: {
           "success": true,
            "message": "貼文ID:665c93a755a500762b17d3e6 已刪除!",
            "data": ""
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

//刪除全部文章
router.delete('/ALL', isAuth, handleErrorAsync(async (req, res, next) => {
    // query params
    const { id } = req.user;

    if (!id.trim() || !mongoose.Types.ObjectId.isValid(id)) {
        return next(appError('id格式異常，請重新確認!', next));
    }

    const postToDelete = await Post.findByIdAndDelete(
        { user: id },
        { new: true }  // 更新
    );

    if (!postToDelete) {
        return next(NotFound(`貼文不存在!`, next));
    }

    Success(res, `貼文已刪除!`);

     /*
     #swagger.tags =  ['貼文牆管理']
     #swagger.path = '/v1/api/posts/ALL'
     #swagger.method = 'delete'
     #swagger.summary='刪除全部文章'
     #swagger.description = '刪除全部文章'
     #swagger.produces = ["application/json"] 
     #swagger.security = [{
       "bearerAuth": []
   }]
   */
  /*
    #swagger.responses[200] = { 
      schema: {
           "success": true,
            "message": "貼文ID:665c93a755a500762b17d3e6 已刪除!",
            "data": ""
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
