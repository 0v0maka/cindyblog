const express = require ("express");
const router = express.Router();
const adminLayout = "../views/layouts/admin";
const adminLayout2 = "../views/layouts/admin-nologout";
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const checkLogin = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        res.redirect("/admin");
    } else {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.userId = decoded.userId;
            next();
        } catch (error) {
            res.redirect("/admin");
        }
    }
};

router.get("/admin", (req, res) => {
    const locals = {
        title: "ADMIN PAGE",
    };

    res.render("admin/index", { locals, layout: adminLayout2 })
});

router.post("/admin", asyncHandler(async (req, res) => {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(401).json({ message: "일치하는 사용자가 없습니다." });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
        }

        const token = jwt.sign({ id: user._id }, jwtSecret);

        res.cookie("token", token, { httpOnly: true });

        res.redirect("/allPosts");
    })
);

router.get("/register", asyncHandler(async (req, res) => {
        res.render("admin/index", { layout: adminLayout2 });
    })
);

router.get("/allPosts", checkLogin, asyncHandler(async (req, res) => {
        const locals = {
            title: "Posts",
        };
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const skip = (page -1) * limit;

        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        const data = await Post.find({}).sort({ _id: -1 }).skip(skip).limit(limit);
        res.render("admin/allPosts", {
            locals,
            data,
            currentPage: page,
            totalPages,
            layout: adminLayout,
        });
    })
);

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

router.get("/add", checkLogin, asyncHandler(async (req, res) => {
        const locals = {
            title: "게시물 작성",
        };
        res.render("admin/add", {
            locals,
            layout: adminLayout,
        });
    })
);

router.post("/add", checkLogin, asyncHandler(async (req, res) => {
        const { title, body } = req.body;

        const newPost = new Post({
            title: title,
            body: body,
        });

        await Post.create(newPost);

        res.redirect("/allPosts");
    })
);

router.get("/edit/:id", checkLogin, asyncHandler(async (req, res) => {
        const locals = {
            title: "게시물 편집",
        };
        
        const data = await Post.findOne({ _id: req.params.id });
        res.render("admin/edit", {
            locals,
            data,
            layout: adminLayout,
        });
    })
);

router.put("/edit/:id", checkLogin, asyncHandler(async (req, res) => {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
        });

        res.redirect("/allPosts");
    })
);

router.delete("/delete/:id", checkLogin, asyncHandler(async (req,res) => {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect("/allPosts");
    })
);

module.exports = router;