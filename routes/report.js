var express = require("express");
var router = express.Router();

var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

// 小报告详情
router.get("/fortune_report/detail", function(req, res, next) {
  
  var reportId = req.query.report_id;
  var userId = req.headers.userid;
  var info = {};
  var fleet=1;
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db('mimapai')
    
    dbo.collection('life_code').find({
      'user_id': userId
    }).toArray(function(err,result){
      info = Object.assign({},result[0],info)
      fleet = result[0].fleet_time
    })

    dbo.collection('user_buy').find({
      'user_id': userId
    }).toArray(function (err, result) {
      // 报告是否购买
      let isBought = result[0].mini_report.indexOf(reportId) == -1?false:true
      
      info.is_locked = isBought

      dbo.collection('mini_report').find({
        'id': reportId
      }).toArray(function (err, result) {
        info = Object.assign({},result[0],info)
        if(isBought){
          info.content = result[0].content[fleet-1].content
          info.keyword = result[0].keyword[fleet-1].keyword
        }else{
          delete info.content
          delete info.keyword
        }

        delete info._id

        res.json(info)
        db.close();
      })
    })
  })
});

//关联报告
router.get("/link", function(req, res, next) {
  
  var reportId = parseInt(req.query.reportId);
  var resultData = []
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db('mimapai')
    dbo.collection('deep_report').find().toArray(function(err,result){
      result.forEach((item)=>{
        delete item._id
        if(item.id != reportId){
          resultData.push(item)
        }
      })
      
      res.json(resultData)
      db.close();
    })
    
  })
})

module.exports = router;
