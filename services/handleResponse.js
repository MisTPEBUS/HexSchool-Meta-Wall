// res success handleResponse
const Success = (res,message = '',  status = 200,data = '') => {
  res.status(status).json({
    success: true,
    message,
    data
  });
};




// res error handleErrorResponse
const Error = (res, status = 400, error) => {

  res.status(status).send({
    success: false,
    message: error.message,
  });
};

// res error handleErrorResponse
const NotFound = (res, status = 404, error) => {
  res.status(status).send({
    success: false,
    message: error.message,
  });
};


// 自訂錯誤
const appError = (httpStatus, errMessage, next) => {
  const error = new Error(errMessage);
  error.status = httpStatus;
  error.isOperational = true;
  next(error);
};

// 回傳 Express 應用程式錯誤處理
const handleAppMainErrorResponse = (env, err, res) => {
  if (env === 'dev') {
    // 開發環境錯誤
    res.status(err.status || 500).json({
      message: err.message || '系統錯誤',
      error: err,
      stack: err.stack
    });
  } else {
    // 正式環境錯誤
    if (err.isOperational) {
      res.status(err.status || 500).json({
        message: err.message
      });
    } else {
      // log 紀錄
      console.error('出現重大錯誤', err);
      0
      res.status(500).json({
        status: 'error',
        message: '系統錯誤，請恰系統管理員'
      });
    }
  }
};

// 處理非同步錯誤
const handleErrorAsync = function handleErrorAsync(func) {
  return function (req, res, next) {
    func(req, res, next).catch(
      function (error) {
        return next(error);
      }
    );
  };
};

module.exports = {
  Success,
  Error,
  NotFound,
  appError,
  handleAppMainErrorResponse,
  handleErrorAsync
};
