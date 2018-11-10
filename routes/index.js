var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //入力画面へリダイレクト
  response.redirect("/shop/regist/input");
//  res.render('index', { title: 'Express3' });
});

module.exports = router;
