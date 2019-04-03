var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var xl = require('xlsx');

// var workbook = xl.readFile("./api/report.xlsx")
// const sheetNames = workbook.SheetNames;
// const worksheet = workbook.Sheets[sheetNames[0]];
// var dataa =xl.utils.sheet_to_json(worksheet);
// res.json(dataa);

// 获得小报告默认详情
router.get('/public/mini_report', function (req, res, next) {

  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db('mimapai')
    dbo.collection('mini_report').find().toArray(function (err, result) {
      result.forEach((value) => {
        delete value.keyword
        delete value.content
        delete value._id
        delete value.connect_str
      })
      res.json(result);
      db.close()
    })
  })
});
// 获得大报告默认详情
router.get('/public/deep_report', function (req, res, next) {

  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db('mimapai')
    dbo.collection('deep_report').find().toArray(function (err, result) {
      // console.log(result)
      res.json(result);
      db.close()
    })
  })
});
// 获取首页轮播图
router.get('/public/swiper', function (req, res, next) {
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db('mimapai')
    dbo.collection('banner').find().toArray(function (err, result) {
      res.json(result);
      db.close()
    })
  })
});

// 获取购买小报告详情
router.get('/mini_fortune/list', function (req, res, next) {
  let resData = res
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db('mimapai')
    var userId = '18120500004439567821'
    dbo.collection('user_buy').find({
      'user_id': userId
    }).toArray(function (err, result) {
      let buyFortune = result[0].mini_report
      let fleetVal = 4
      dbo.collection('mini_report').find().toArray((res, result) => {
        let data = []
        result.forEach((value) => {
          delete value._id
          delete value.content
          if (buyFortune.indexOf(value.id) == -1) {
            delete value.keyword
            delete value.content
            delete value.connect_str
          } else {
            value.keyword = value.keyword[fleetVal].keyword
          }
        })
        resData.json(result);
        db.close()
      })
    })

  })
});

module.exports = router;