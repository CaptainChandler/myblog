var express = require('express');
var routers = express.Router();
// var Profile = require('../model/profile');

routers.get('/', function(req, res, next) {

    
    if(req.session.showname) {
        res.render('chatroom', {title: '聊天页面', username: req.session.showname});
      }
      else {
        res.render('login', { title: '登录' }); 
      }
});


module.exports = routers; 