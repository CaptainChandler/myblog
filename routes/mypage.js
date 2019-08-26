var express = require('express');
var routers = express.Router();

routers.get('/', function(req, res, next) {
    
    if(req.session.showname) {

        res.render('mypage', {title: '主页', username: req.session.showname});
        
      }
      else {
        res.render('login', { title: '登录' }); 
      }
});

module.exports = routers; 