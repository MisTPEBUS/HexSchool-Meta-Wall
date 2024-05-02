var express = require('express');
var router = express.Router();
const Post = require("../models/posts");

//查詢全部貼文
router.get('/', async function (req, res, next) {
    try {
        const posts = await Post.find();

        res.status(200).json({
            success: true,
            message: "搜尋成功",
            posts: posts
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            success: false,
            message: "查詢異常",
            errMsg: err.message
        })
    }
});

//查詢單一貼文
router.get('/:id', async function (req, res, next) {
    const { id } = req.params;
    try {
        const posts = await Post.findById(id);

        res.status(200).json({
            success: true,
            message: "搜尋成功",
            posts: posts
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            success: false,
            message: "查詢異常",
            errMsg: err.message
        })
    }
});

//新增貼文
router.post('/', async function (req, res, next) {
    console.log(req.body)
    try {
        const newPost = await Post.create(req.body);
        console.log(newPost)
        res.status(200).json({
            success: true,
            message: "已建立貼文",
            post: newPost
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            success: false,
            message: "無法建立貼文",
            errMsg: err.message
        })
    }


});

//更新貼文
router.put('/:id', async function (req, res, next) {
    const { id } = req.params;
   console.log('body', req.body);
    try {
        const newPost = await Post.findByIdAndUpdate(id, req.body,{ new: true });
        if (newPost) {
                res.status(200).json({
                success: true,
                message: "已修改貼文",
                post: newPost
            });
        } else {
            res.status(404).json({
                success: false,
                message: "找不到貼文",
            });
        }
       
    } catch (err) {
        console.log(err)
        res.status(400).json({
            success: false,
            message: "無法建立貼文",
            errMsg: err.message
        })
    }


});

//刪除文章

router.delete('/:id', async function (req, res, next) {
    // query params
    const { id } = req.params;
    

    try {
        const newPost = await Post.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: `貼文ID:${id} 已刪除!` 
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            success: false,
            message: "無法建立貼文",
            errMsg: err.message
        })
    }


});

module.exports = router;
