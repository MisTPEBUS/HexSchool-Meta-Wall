var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const postRouter = require('./routes/posts');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});
const mongoose = require('mongoose');

const constr = process.env.DATABASE.replace(
    '<password>'
    ,process.env.DATABASE_PASSWORD);

mongoose.set('strictQuery', false);

mongoose
    .connect(constr)
    .then(() => console.log("連線資料成功"));

var app = express();


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter);

// 404 錯誤
app.use(function(req, res, next) {
    res.status(404).json({
      status: 'error',
      message: "查無此路由，請確認API格式!",
    });
  });

module.exports = app;
