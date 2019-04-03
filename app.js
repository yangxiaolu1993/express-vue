var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var routes = require('./routes');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

routes(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 插入
// MongoClient.connect(url, {
//   useNewUrlParser: true
// }, function (err, db) {
//   if (err) throw err;
//   var dbo = db.db('mimapai')
//   var data = {"surplus":0,"exists":0,"user_id":"18120500004439567821","nickname":"璐璐","birthday":"19930307","sex":2,"phone":"150****2187","avatar":"https://img.xuanyiai.com/FjnSCuIpFUXBXIuyx3JQPJnrKsRO","area":"新疆维吾尔自治区;博尔塔拉蒙古自治州","user_type":0,"birthday_modify_time":"2018-12-05 09:48:37","create_time":"2018-12-05","education":0,"profession":0,"relationship_status":0,"sex_update_count":1,"birthday_update_count":1,"master_code":5,"master_code_description":"自由冒险的5号人","birthday_pattern":"Hi~26岁的5号小姐姐！~","birthplace":"新疆维吾尔自治区;克孜勒苏柯尔克孜自治州","birth_latitude_and_longitude":"39.750345577845096;76.13756447746248","status":3,"code":0,"type":1,"need_update_birthday_relate_info":false,"age":26,"model":"HUAWEI_DUK-AL20","im_token":"ETJAebs1o/DQxLyvMFu8Yf8+wSS7/BUZQNP6s0NspmNjLtA4SdfP9etkiL9pncuKo8BqnBEsDMR6itaMru3NMrhSS8wwtzG+FtQaGP1oKhn1GnAxbn3w5w=="}
//   dbo.collection('users').insertOne(data, function (err, res) {
//     console.log("插入成功!");
//     db.close();
//   });
// });

module.exports = app;