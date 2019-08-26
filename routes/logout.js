var express = require('express');
var routers = express.Router();

routers.get('/', function(req, res, next) {
    // req.session.destroy();
    // console.log(req.session.username);
    req.session.login = '0';
    res.render('login', {title: '登录'});
});



module.exports = routers; 