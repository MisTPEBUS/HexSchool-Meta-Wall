const express = require('express');
const router = express.Router();
const Post = require("../models/posts");

//查詢全部貼文
router.get('/', async function (req, res, next) {
    const { timeSort, keyWord } = req.query;
    //設定排序為時間近到遠還是遠道近(預設時間近期貼文)
    const tSort = timecSort == "asc" ? "createdAt" : "-createdAt"
    let query = {};

    //關鍵字針對Model中userName + content 搜尋
    if (keyWord) {
        query.$or = [
            { userName: new RegExp(keyWord, 'i') },
            { content: new RegExp(keyWord, 'i') }
        ];
    }

    try {
        const posts = await Post.find(query).populate('user').sort(tSort);

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
        const post = await Post.findById(id);

        res.status(200).json({
            success: true,
            message: "搜尋成功",
            posts: post
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
    const { content }  = req.body;
    try {
        if (!content.trim()) {
            return res.status(400).json({
                success: false,
                message: `content不能為空值!`,
            })
        }
        const newPost = await Post.create(req.body);
        
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
    const { content } = req.body;

    try {
        if (!content.trim()) {
            return res.status(400).json({
                success: false,
                message: `Content不得為空值!`,
            });
        }

        const postToUpdate = await Post.findOneAndUpdate({ id }, req.body, { new: true });

        if (!postToUpdate) {
            return res.status(404).json({
                success: false,
                message: `此貼文ID:${id}不存在!`,
            });
        }

        res.status(200).json({
            success: true,
            message: "已修改貼文",
            post: postToUpdate
        });
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
        const postToDelete = await Post.findOneAndDelete({ id });

        if (!postToDelete) {
            return res.status(404).json({
                success: false,
                message: `此貼文ID:${id}不存在!`,
            })
        }

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
