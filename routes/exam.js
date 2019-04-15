var express = require("express");
var router = express.Router();

var lifeCode = require('../public/javascripts/lifeCode')

var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

router.get("/", function(req, res, next) {
  MongoClient.connect(
    url,
    {
      useNewUrlParser: true
    },
    function(err, db) {
      if (err) throw err;
      var dbo = db.db("mimapai");
      dbo.collection("life_code").aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "user_id",
            as: "users_docs"
          }
        }
      ]).toArray((err,result)=>{
          res.json(result)
      });
    }
  );
});




module.exports = router;
