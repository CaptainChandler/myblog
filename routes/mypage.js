var express = require('express');
var routers = express.Router();

routers.get('/', function(req, res, next) {
    
    if(req.session.showname) {

      if(req.session.domainname != "" && req.session.domainname != undefined) {

        res.render('mypage', {title: '主页', username: req.session.showname});
      }
      else {
        var profile = {};
        profile.domainname = "";
        req.session.profile = profile;
        res.render('profile', {title: '个人资料', editable: ''});
      }
        
      }
      else {
        res.render('login', { title: '登录' }); 
      }
});

module.exports = routers; 