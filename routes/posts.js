const express = require('express');
const router = express.Router();
const Post = require("../models/posts");
const resHandler = require("../services/handleResponse");

//查詢全部貼文
router.get('/', async function (req, res) {
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
    try {
        const posts = await Post.find(query).populate('User').sort(tSort);
        resHandler.Success(res, '', 200, posts);
    } catch (err) {
        resHandler.Error(res, 400, err);
    }
});

//查詢單一貼文
router.get('/:id', async function (req, res) {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        resHandler.Success(res, '', 200, post);
    } catch (err) {
        resHandler.Error(res, 400, err);
    }
});

//新增貼文
router.post('/', async function (req, res) {
    const { content } = req.body;
    console.log(content)
    try {
        if (!content.trim()) {
            return resHandler.Error(res, 400, { message: `content不能為空值!` });
        }
        const newPost = await Post.create(req.body);
        resHandler.Success(res, "已建立貼文", 201, newPost);

    } catch (err) {
        resHandler.Error(res, 400, err);
    }


});

//更新貼文
router.put('/:id', async function (req, res) {
    const { id } = req.params;
    const { content } = req.body;
    try {
        if (!content.trim()) {
            return resHandler.Error(res, 400, { message: `Content不得為空值` });
        }

        if (!id.trim()) {
            return resHandler.Error(res, 400, { message: `ID不得為空值` });
        }

        const postToUpdate = await Post.findOneAndUpdate({ _id: id }, req.body, { new: true });

        if (!postToUpdate) {
            return resHandler.Error(res, 400, { message: `此貼文ID:${id}不存在!` });
        }
        resHandler.Success(res, "已修改貼文", 200, postToUpdate);

    } catch (err) {
        resHandler.Error(res, 400, err);

    }
});

//刪除文章

router.delete('/:id', async function (req, res) {
    // query params
    const { id } = req.params;
    try {
        const postToDelete = await Post.findOneAndDelete({ _id: id });
       
        if (!postToDelete) {
            return resHandler.Error(res, 400, { message: `此貼文ID:${id}不存在!` });

        }
        resHandler.Success(res, `貼文ID:${id} 已刪除!`);

    } catch (err) {
        resHandler.Error(res, 400, err);

    }
});

module.exports = router;
