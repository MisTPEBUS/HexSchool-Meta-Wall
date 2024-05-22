const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

const postRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

// 程式出現重大錯誤時
process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！')
  console.error(err);
  process.exit(1);
});

const constr = process.env.DATABASE.replace(
  '<password>'
  , process.env.DATABASE_PASSWORD);

mongoose.set('strictQuery', false);

mongoose
  .connect(constr)
  .then(() => console.log("連線資料成功"));

  const app = express();


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use('/users', usersRouter);
app.use('/posts', postRouter);

// 404 錯誤
app.use(function (req, res, next) {
  res.status(404).json({
    status: 'error',
    message: "查無此路由，請確認API格式!",
  });
});

// 未捕捉到的 catch 
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
  // 記錄於 log 上
});

module.exports = app;
