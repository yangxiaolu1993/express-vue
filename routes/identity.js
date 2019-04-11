var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

/* GET users listing. */
router.get('/card', function (req, res, next) {
  // 插入
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db('mimapai')
    dbo.collection('card').find().toArray(function (err, result) {
      result.forEach((value) => {
        delete value._id
      })
      res.json(result)
      db.close();
    });
  });
});

module.exports = router;