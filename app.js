require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const connectDB = require('./config/db');
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

const app = express();
const port = process.env.PORT || 3000;

connectDB();

// layout and view engine setting
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", "./views");

// static file
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(cookieParser());

app.use("/", require("./routes/main"));
app.use("/", require("./routes/admin"));

app.listen(port,() => {
    console.log(`App listening on port ${port}`);
});