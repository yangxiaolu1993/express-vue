var indexRouter = require('./routes/index');
var identityRouter = require('./routes/identity');
var reportRouter = require('./routes/report');
var friendsRouter = require('./routes/friends');
var examRouter = require('./routes/exam');
var userRouter = require('./routes/user');

function routes(app){
    app.use('/', indexRouter);
    app.use('/identity', identityRouter);
    app.use('/report',reportRouter);
    app.use('/friends',friendsRouter);
    app.use('/exam',examRouter);
    app.use('/user',userRouter);
    
    app.all('*', function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
      res.header("X-Powered-By", ' 3.2.1')
      res.header("Content-Type", "application/json;charset=utf-8");
      next();
    })
}

module.exports = routes