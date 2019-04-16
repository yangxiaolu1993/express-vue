var express = require("express");
var router = express.Router();

var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

var lifeCode = require("../public/javascripts/lifeCode");
var sd = require('silly-datetime'); 
/**
 * ===================================== 获取派友列表 ==================================
 */
router.get("/list", function(req, res, next) {
  var data = {};
  var type = parseInt(req.query.type);
  var userId = req.headers.userid;
  var index = parseInt(req.query.index);
  var pageSize = parseInt(req.query.page_size);
  MongoClient.connect(
    url,
    {
      useNewUrlParser: true
    },
    function(err, db) {
      if (err) throw err;
      var dbo = db.db("mimapai");
      dbo.collection("friends")
        .find({
          slave_user_id: userId,
          origin: type
        })
        .skip(index)
        .limit(pageSize)
        .toArray((err, result) => {
          var resulteData = []
          result.forEach(item => {
            if(item.status == 1){
              let num = (''+item._id).substring((''+item._id).length-4)
              item.id = item.user_id
              delete item.user_id;
              delete item._id;
              delete item.status;
              delete item.slave_user_id;
              resulteData.push(item)
            }
            
          });
          data.list = resulteData;
        });
      dbo.collection("friends")
        .find({
          slave_user_id: userId,
          origin: type
        })
        .toArray((err, result) => {
          data.total = result.length;
          res.json(data);
        });
    }
  );
  
});

/**
 * ===================================== 添加好友 ==================================
 */
router.get("/add", (req, res, next) => {
  
  let param = req.query;
  let masterCode = lifeCode.createMasterCode(param.birthday);
  let masterCodeDesc = lifeCode.masterCodeDesc(masterCode);
  MongoClient.connect(
    url,
    {
      useNewUrlParser: true
    },
    function(err, db) {
      if (err) throw err;
      var dbo = db.db("mimapai");
      
      var data = {
        surplus: 0,
        exists: 0,
        user_id: createUserId(),
        name: param.name,
        avatar: "http://img.xuanyiai.com/Finq7llw5Lwfd0u0HsMIFw1LTaXr",
        master_code: masterCode,
        master_code_description: masterCodeDesc,
        birthday: param.birthday,
        sex: param.sex,
        relationship_type: 4,
        origin: parseInt(param.origin),
        born_area: req.query.born_area || '',
        born_time: req.query.born_time || '',
        born_latitude: req.query.born_latitude || '',
        born_longitude: req.query.born_longitude || '',
        is_repeat: 0,
        status: "1",
        slave_user_id: req.headers.userid
      };
      dbo.collection("friends").insertOne(data, function(err, result) {
        res.json({
          code:200,
          data:'删除成功！'
        });
        db.close();
      });
    }
  );
});

/**
 * ===================================== 删除好友 ==================================
 */
router.get("/delete", (req, res, next) => {
  var query  = req.query.id
  MongoClient.connect(url,{useNewUrlParser: true},function(err, db) {
    if (err) throw err;
    var dbo = db.db("mimapai");

    dbo.collection("friends").update(
      { user_id: query },
      { $set:
        {
          status: 0,
        }
     },function(err,result){
       result = {
         'code':200
       }
        res.json(result)
     }
    )
  })
      
})

// 生成userid: 当前年月日+随机数(7位)
function createUserId(){
  var num = parseInt(Math.random()*10000000),
  id = sd.format(new Date(), 'YYYYMMDD')+addPreZero(num);

  return id
}
// 补0
function addPreZero(num,digit=7){
  var t = (num+'').length,
  s = '';
  
 for(var i=0; i<digit-t; i++){
  s += '0';
 }

 return s+num
}

module.exports = router;
