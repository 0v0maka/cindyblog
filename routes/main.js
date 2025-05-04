const express = require("express");
const router = express.Router();
const mainLayout = "../views/layouts/main.ejs";
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const asynchandler = require("express-async-handler");

router.get(["/", "/home"], 
    asynchandler(async (req, res) => {
        const locals = {
            title: "HOME",
        };
        const data = await Post.find({}).sort({ _id: -1 });
        res.render("index", { locals, data, layout: mainLayout });
    })
);

router.get("/post/:id",
    asynchandler(async (req, res) => {
        const data = await Post.findOne({ _id: req.params.id });
        res.render("post", { data, layout: mainLayout });
    })
);

router.get("/about", (req, res) => {
    const locals = {
        title: "ABOUT"
    }
    res.render("about", { locals, layout: mainLayout });
});

router.get("/article",
    asynchandler(async (req, res) => {
        const locals = {
            title: "ARTICLE",
        };
        const data = await Post.find({}).sort({ _id: -1 });
        res.render("article", {locals, data, layout: mainLayout});
    })
);

router.get("/board",
    asynchandler(async (req, res) => {
        const locals = {
            title: "BOARD",
        };
        const data = await Comment.find({}).sort({ _id: -1 });
        res.render("board", {locals, data, layout: mainLayout});
    })
);

router.get("/comment/:id",
    asynchandler(async (req, res) => {
        const data = await Comment.findOne({ _id: req.params.id });
        res.render("comment", { data, layout: mainLayout });
    })
);

router.get("/addcomment",
    asynchandler(async (req, res) => {
        const locals = {
            title: "응원남기기",
        };
        res.render("addcomment", {locals, layout: mainLayout});
    })
);

router.post("/addcomment",
    asynchandler(async (req, res) => {
        const { nickname, title, body } = req.body;

        const newComment = new Comment({
            nickname: nickname,
            title: title,
            body: body,
        });

        await Comment.create(newComment);

        res.redirect("/board");
    })
);

module.exports = router;