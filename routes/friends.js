var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


// 获取派友列表
router.get('/list', function (req, res, next) {
    console.log(req.query)
    var type = parseInt(req.query.type)
    var userId = req.headers.userid
    MongoClient.connect(url, {
        useNewUrlParser: true
      }, function (err, db) {
        if (err) throw err;
        var dbo = db.db('mimapai')
        dbo.collection('friends').find({
            'slave_user_id':userId,
            'origin':type
        }).toArray((err,result)=>{
            result.forEach((item)=>{
                delete item._id
                delete item.status
                delete item.slave_user_id
            })
            var data = {
                list:result,
                total:result.length
            }
            res.json(data)
        })
    })
})

module.exports = router;