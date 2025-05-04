const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Comment", CommentSchema);