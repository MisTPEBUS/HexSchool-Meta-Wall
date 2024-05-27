const express = require('express');
const router = express.Router();
const Post = require("../models/posts");
const resHandler = require("../services/handleResponse");
const mongoose = require('mongoose');
const { Success, NotFound, appError } = require('../services/handleResponse.js');
const { handleErrorAsync } = require('../services/handleResponse.js');
//需要week6 加入jwt取ID 所以week5暫時從body取UserID
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

}));

//查詢單一貼文
router.get('/:id', handleErrorAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id.trim() || !mongoose.Types.ObjectId.isValid(id)) {
        return next(appError('id格式異常，請重新確認!', next));
    }
    const postToSearch = await Post.findById(id);
    if (!postToSearch) {
        return next(NotFound(`此貼文ID:${id}不存在!`, next));
    }
    Success(res, '', postToSearch);
}));

//新增貼文
router.post('/', handleErrorAsync(async (req, res, next) => {
    const { content } = req.body;

    if (!content.trim()) {
        return next(appError('Content不能為空值!', next));
        
    }
    const newPost = await Post.create(req.body);

    Success(res, "已建立貼文", newPost, 201);
}));

//更新貼文
router.put('/:id', handleErrorAsync(async (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;

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
        return next(appError(404, `此貼文ID:${id}不存在!`, next));
    }

    Success(res, `已修改貼文!`, postToUpdate, 200);
}));

//刪除文章
router.delete('/:id', handleErrorAsync(async (req, res, next) => {
    // query params
    const { id } = req.params;

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

    Success(res, `貼文ID:${id} 已刪除!`,postToDelete, 200);
}));

//刪除全部文章
router.delete('/ALL', handleErrorAsync(async (req, res, next) => {
    // query params
    const { user } = req.body;

    if (!user.trim() || !mongoose.Types.ObjectId.isValid(user)) {
        return next(appError('id格式異常，請重新確認!', next));
    }

    const postToDelete = await Post.findByIdAndDelete(
        { user: user },
        { new: true }  // 更新
    );

    if (!postToDelete) {
        return next(NotFound(`此貼文ID:${id}不存在!`, next));
    }

    Success(res, `貼文ID:${id} 已刪除!`,postToDelete, 200);
}));

module.exports = router;
