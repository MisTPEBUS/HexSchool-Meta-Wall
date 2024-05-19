var express = require('express');
var router = express.Router();
const Post = require("../models/posts");

const handleErrorAsync = require('../service/handleErrorAsync.js');
const appError = require('../service/appError.js');

//查詢全部貼文
router.get('/', async function (req, res)  {
    const { timeSort, keyWord } = req.query;
    //設定排序為時間近到遠還是遠道近(預設時間近期貼文)
    const tSort = timeSort == "asc" ? "createdAt" : "-createdAt"
    let query = {};

    //關鍵字針對Model中userName + content 搜尋
    if (keyWord) {
        query.$or = [
            { userName: new RegExp(keyWord, 'i') },
            { content: new RegExp(keyWord, 'i') }
        ];
    }
    const posts = await Post.find(query).populate('user').sort(tSort);

    res.status(200).json({
        success: true,
        message: "搜尋成功",
        posts: posts
    })

});

//查詢單一貼文
router.get('/:id', handleErrorAsync(async (req, res, next) => {
    const { id } = req.params;
    if(!id){
        next(appError(400, "貼文ID不得為空值!", next))
    }
    const post = await Post.findOne({id:id});
    res.status(200).json({
        success: true,
        message: "搜尋成功",
        post: post
    })
}));

//新增貼文
router.post('/', handleErrorAsync(async (req, res, next) => {
    const { user, content } = req.body;
    //需要week6 加入jwt取ID 所以week5放在body
    if (!user) {
        return next(appError("400", "userID欄位不能為空值！", next));
    }
    if (!content) {
        return next(appError("400", "Content欄位不能為空值！", next));
    }
    const newPost = await Post.create({
        user,
        content,
        userPhoto,
        image
    });
    res.status(200).json({
        "status": true,
        "message": "新增成功!",
        post: newPost
    })


}));

//更新貼文
router.put('/:id', handleErrorAsync(async (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({
            success: false,
            message: `Content不得為空值!`,
        });
    }
   
    if(!id){
        return next(appError(400,`此貼文ID:${id}不存在!`,next));
    }

    if (!req.body.user) {
        return res.status(400).json({
            success: false,
            message: `userID不得為空值!`,
        });
    }


    const postToUpdate = await Post.findOneAndUpdate({ id }, req.body, { new: true });
        res.status(200).json({
            success: true,
            message: "已修改貼文",
            post: postToUpdate
        });

}));

//刪除文章

router.delete('/:id', handleErrorAsync(async (req, res, next) => {
    // query params
    const { id } = req.params;

    if(!id){
        return next(appError(404,`此貼文ID:${id}不存在!`,next));
    }

    const postToDelete = await Post.findOneAndDelete({ id });

    res.status(200).json({
        success: true,
        message: `貼文ID:${id} 已刪除!`
    })
   

}));

module.exports = router;
