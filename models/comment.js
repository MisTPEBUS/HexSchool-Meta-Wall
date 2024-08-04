const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: [true, 'Comment欄位不能為空值!']
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            require: [true, '貼文必須關聯使用者!']
        },
        post: {
            type: mongoose.Schema.ObjectId,
            ref: 'Post',
            require: ['true', '留言必須關聯貼文!'],
        }
    }, {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
);
commentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'id name photo createdAt'
    });

    next();
});
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
