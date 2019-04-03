var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log('插入')
  // 插入
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db('mimapai')
    var data = [{"image_url":"http://img.xuanyiai.com/邀请好友送6元new.jpg","authorize_type":1,"jump_type":1,"jump_url":"/pages/small_test/small_test?url=https://mp.weixin.qq.com/s/0qiZsNqPnowHiojUvm58gA"},{"image_url":"http://img.xuanyiai.com/个人情感报告new.jpg","authorize_type":1,"jump_type":1,"jump_url":"/pages/small_test/small_test?url=https://mimapi.xuanyiai.com"},{"image_url":"http://img.xuanyiai.com/Fj5wXZhmkrFyAAONZ7AjOMiwvo9W","authorize_type":1,"jump_type":1,"jump_url":"/pages/small_test/small_test?url=https://mimapi.xuanyiai.com"}]
    dbo.collection('banner').insertMany(data, function (err, res) {
      console.log("插入成功!");
      db.close();
    });
  });
});

module.exports = router;