var express = require("express");
var router = express.Router();

var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
var lifeCode = require("../public/javascripts/lifeCode");
/**
 * 密码解读
 */
router.get("/code/reading", function(req, res, next) {
  console.log(req.query);

  var resData = {},
    id = req.query.id,
    birth = "";

  MongoClient.connect(
    url,{useNewUrlParser: true},function(err, db) {
      if (err) throw err;
      var dbo = db.db("mimapai");

      //获取生日
      dbo.collection("friends")
        .find({
          user_id: id
        })
        .toArray(function(err, result) {
          birth = result[0].birthday;
          console.log(result)
          resData.nickname = result[0].name
          resData.label = result[0].master_code_description
        });

      dbo
        .collection("mini_report_detail")
        .find()
        .toArray(function(err, result) {
          // console.log(result)
          var detail = result;
          var [character, external, inner, talent, emotion] = [...detail];

          //生命密码
          var life_number = lifeCode.createCode(birth);
          resData.life_number = life_number;
          // 主码
          var masterCode = lifeCode.createMasterCode(birth);
          resData.master_code = masterCode;
          // 外心码
          var outward = life_number.outward;
          resData.outward = outward;
          // 内心码
          var inward = life_number.inward;
          resData.inward = inward;

          // 天赋密码
          var talentward = talentCode(birth).talentCode
          resData.characteristic_code = talentward.join("");
          // 缺失密码
          resData.missing_code = talentCode(birth).missingCode.join("");

          // 情绪状态码
          var emotionward = emotionCode(birth)

          var descAll = [
            character.desc[masterCode-1],
            external.desc[transNum(outward)],
            inner.desc[inward],
            talent.desc[0],
            emotion.desc[emoTransNum(birth)]
          ];
          var descAllMap = descSpecialSort(descAll)

          // 特殊字符处理
          var talentSpecial = []
          talentward.forEach(item=>{
            talentSpecial.push(talent.special_text_map[item-1])
          })

          var specialTextAll = [
            ...character.special_text_map[masterCode-1],
            ...external.special_text_map[transNum(outward)],
            ...inner.special_text_map[inward],
            talentSpecial,
            emotion.special_text_map[emoTransNum(birth)]
          ];
          var special_text_map = specialTextSort(specialTextAll);
          resData.special_text_map = special_text_map;

          // 性格特点
          var character_description = [];
          character_description.push(character.title + masterCode);
          character_description.push(character.sub_title);
          character_description.push(descAllMap[0])
          resData.summary_description = character_description

          // 价值观
          var worth_desc = []
          worth_desc.push(external.title+outward)
          worth_desc.push(external.sub_title)
          worth_desc.push(descAllMap[1])
          resData.worth_sense_description = worth_desc

          //内心世界
          var inward_desc = []
          inward_desc.push(inner.title+inward)
          inward_desc.push(inner.sub_title)
          inward_desc.push(descAllMap[2])
          resData.inward_description = inward_desc
          
          // 天赋
          var talent_desc = []
          talent_desc.push(talent.title+resData.characteristic_code)
          talent_desc.push(talent.sub_title)
          talent_desc.push(descAllMap[3])
          resData.characteristic_description = talent_desc

          // 情绪状态
          var emotion_desc = []
          emotion_desc.push(emotion.title[emoTransNum(birth)])
          emotion_desc.push(emotion.sub_title)
          emotion_desc.push(descAllMap[4])
          resData.emotion_description = emotion_desc

          // 五行
          resData.five_elements = lifeCode.fiveElement(masterCode)

          res.json(resData);
        });
    }
  );
});

/**
 * 特殊字符组合处理
 * @param {*} special 特殊字符的数据
 * @param {*} special_map 合并的对象
 */
function dealSpecial(special, special_map = {}) {
  var special_new = {},
    len = Object.keys(special_map).length;
  special.forEach((item, index) => {
    var i = index + 1 + len;
    special_new["@" + i + "@"] = item;
  });

  special_map = Object.assign({}, special_map, special_new);

  return special_map;
}
/**
 * 数字转换
 * @param {*} num 需要转换的数字
 */
function transNum(num) {
  switch (num) {
    case 3:
      return 0;
    case 6:
      return 1;
    case 9:
      return 2;
  }
}

/**
 * 情绪状态码
 * @param {*} birth 生日
 */
function emotionCode(birth) {
  var lifeNum = lifeCode.createCode(birth);
  var talentCode = [
    lifeNum.i,
    lifeNum.j,
    lifeNum.k,
    lifeNum.l,
    lifeNum.m,
    lifeNum.n,
    lifeNum.o
  ];
  talentCode = [...new Set(talentCode)];

  var emotionCode = [];
  if (talentCode.indexOf(3) != -1) {
    emotionCode.push(3);
  }
  if (talentCode.indexOf(8) != -1) {
    emotionCode.push(8);
  }

  return emotionCode;
}
/**
 * 情绪状态数字转化
 * @param {*} birth
 */
function emoTransNum(birth) {
  var emoCode = emotionCode(birth),
    len = emoCode.length;
  switch (len) {
    case 0:
      return 0;
    case 1:
      return emoCode[0] == 3 ? 1 : 2;
    case 2:
      return 3;
  }
}

/**
 * 天赋密码和缺失密码
 */
function talentCode(birth) {
  var lifeNum = lifeCode.createCode(birth);
  var talentCode = [
    lifeNum.i,
    lifeNum.j,
    lifeNum.k,
    lifeNum.l,
    lifeNum.m,
    lifeNum.n,
    lifeNum.o
  ];
  // 天赋密码
  talentCode = [...new Set(talentCode)].sort((a,b) => {return a-b;});
  //缺失密码
  var a = new Set(talentCode);
  var b = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  var missingCode = [...new Set([...b].filter(x => !a.has(x)))];

  return { talentCode, missingCode };
}

/**
 * 将描述中的 @*@ 符号按照顺序排列
 * @param {*} desc 需要排列的数组
 */
function descSpecialSort(desc) {
  var i = 0,
    newDesc = [];
  desc.forEach(item => {
    var b = item.replace(/@.@/g, function(match) {
      i++;
      return "@" + i + "@";
    });
    newDesc.push(b);
  });

  return newDesc;
}

/**
 * 特殊字符替换
 */
function specialTextSort(special){
  var newSpecial = {}
  special.forEach((item,i)=>{
    newSpecial['@'+(i+1)+'@'] = item
  })

  return newSpecial
}

module.exports = router;
