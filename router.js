var router = require("express").Router();
var co = require("co");
var MongoClient = require("mongodb").MongoClient;
var Tokens = require("csrf");
var tokens = new Tokens();
 
/**
 * リクエストボディーからデータを抽出
 */
var extract = function (request) {
  return {
    name: request.body.name,
    age: request.body.age,
    sex: request.body.sex,
    tel: request.body.tel,
    zipcode: request.body.zipcode,
    location: request.body.location,
    _csrf: request.body._csrf
  };
};
 
/**
 *  リクエストデータを検証
 */
var validate = function (data) {
  var errors = data.errors = [];
 
  if (!data.name) {
    errors[errors.length] = "氏名を指定してください。";
  }
 
  if (!data.age) {
    errors[errors.length] = "年齢を指定してください。";
  }

  if (!data.sex) {
    errors[errors.length] = "性別を指定してください。";
  }

  if (!data.tel) {
    errors[errors.length] = "電話番号を指定してください。";
  }
 
  if (!data.zipcode) {
    errors[errors.length] = "郵便番号を指定してください。";
  }

  if (!data.location) {
    errors[errors.length] = "住所を指定してください。";
  }
 
 
  return errors.length === 0;
};
 
/**
 * リクエストデータを登録
 */
var commit = function (data, callback) {



  var AWS = require("aws-sdk");

  AWS.config.update({
    region: "ap-northeast-1",
    endpoint: "http://localhost:8000"
  });
  
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
      TableName: "test",
      Key:{
          "id": "1"
      }
  };
  
  docClient.get(params, function(err, data) {
      if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
      }
  });
 console.log('--- 23\n');

//  var fs = require('fs-extra')
//  fs.mkdirsSync('/app/tmp/');


  const URL = "mongodb://localhost:27017/test";
  return co(function* () {
    // MongoDB へ 接続
    var db = yield MongoClient.connect(URL);
   var collection = db.collection("shops");
    var result = yield collection.updateOne(
      { name: { $eq: data.name } },
      { $set: data },
      { upsert: true },
      (error, result) => {
        // MongoDB 切断
        db.close();
        callback && callback();
      });
  }).catch((reason) => {
    console.error(JSON.stringify(reason));
  });


};
 
/**
 * GET: /shop/regist/input
 */
router.get("/regist/input", function (request, response) {
  // 新規に 秘密文字 と トークン を生成
  var secret = tokens.secretSync();
  var token = tokens.create(secret);
 
  // 秘密文字はセッションに保存
  request.session._csrf = secret;
 
  // トークンはクッキーに保存
  response.cookie("_csrf", token);
 
  // 入力画面の表示
  response.render("./shop/regist/input.ejs");
});
 
/**
 * POST: /shop/regist/input
 */
router.post("/regist/input", function (request, response) {
  // 入力データを取得
  var data = extract(request);

  data = {
    name: "12345"
  }

  process.stdout.write('--- test 123\n');

  // 入力画面の再表示
  response.render("./shop/regist/input.ejs", data);
});
 
/**
 * POST: /shop/regist/confirm
 */
router.post("/regist/confirm", function (request, response) {
  // 入力データを取得
  var data = extract(request);
 
  // 入力データの検証
  if (validate(data) === false) {
    return response.render("./shop/regist/input.ejs", data);
  }
 
  response.render("./shop/regist/confirm.ejs", data);
});
 
/**
 * POST: /shop/regist/complete
 */
router.post("/regist/complete", function (request, response) {
  // 秘密文字 と トークン を取得
  var secret = request.session._csrf;
  var token = request.cookies._csrf;
 
  // 秘密文字 と トークン の組み合わせが正しいか検証
//  if (tokens.verify(secret, token) === false) {
//    throw new Error("Invalid Token");
//  }
  // 入力データを取得
  var data = extract(request);
  // 入力データの検証
  if (validate(data) === false) {
    return response.render("./shop/regist/input.ejs", data);
  }

  // 登録処理

  commit(data).then(() => {
    // 使用済み 秘密文字 と トークン の無効化
    delete request.session._csrf;
    response.clearCookie("_csrf");

    // 完了画面へリダイレクト
    response.redirect("/shop/regist/complete");
  });

});
 
/**
 * GET: /shop/regist/complete
 */
router.get("/regist/complete", function (request, response) {
  response.render("./shop/regist/complete.ejs");
});
 
module.exports = router;
