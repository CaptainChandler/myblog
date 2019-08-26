var express = require('express');
var routers = express.Router();
var User = require('../model/user');
var Profile = require('../model/profile');

routers.get('/', function(req, res, next) {
    res.render('register', {title: '注册'});
});

routers.post('/', function(req, res, next) {
    
    var ctime = new Date();
    var flgUser = true;
    var flgProfile = true;

    var user =  new User({
        username: req.body.username,
        password: req.body.password,
        ctime: ctime,
        last_logintime: '1900-01-01 00:00:00',
        utime: ctime,
    })

    var profile =  new Profile({
        username: req.body.username,
        nickname: '',   
        email: '',
        tel: '',
        QQ: '',
        other: '',
        selfintro: '',
        ctime: '',
        utime: '',
    })

    
    function doSaveUser(){
        return new Promise(function(resolve){
            user.save(function(err, cb){
                if(err) {
                    console.log('DB:register error, refer info as below:' + err);
                    flgUser = false;
                }
                else {
                    console.log('user registed as below:' + user);
                    flgUser = true;
                    console.log("step1");
                    resolve();
                }
            });
        });        
    };

    function doSaveProfile(){
        return new Promise(function(resolve){
            profile.save(function(err, cb){
                if(err) {
                    console.log('DB:save profile error, refer info as below:' + err);
                    flgProfile = false;
                }
                else {
                    console.log('save profile success');
                    flgProfile = true;
                    console.log("step2");
                    resolve();
                }
            });
        });
        
    };

    async function doRender(){
        await doSaveUser();
        
        if(flgUser === false){
            req.session.username = "";
            req.session.nickname = "";
            req.session.showname = "";
            res.render('register', {title: '注册失败'});
        } else {
            await doSaveProfile();

            if(flgProfile === false) {
                res.render('register', {title: '注册失败'});  
                req.session.username = "";
                req.session.nickname = "";
                req.session.showname = "";
                //此处其实应该把USER&PROFILE设计成一个事务，不成功就全部回滚，但我还没学会，哈哈
            }
            else {
                req.session.username = req.body.username;
                req.session.nickname = "";
                req.session.showname = req.body.username;
                res.render('welcome', {title: 'Welcome', message: req.body.username + '，恭喜你成为我的小乖乖~'});
                console.log("step3");
            }            
        }
    };

    doRender();
});

routers.post('/ifexist', function(req, res, next) {
    
    //先查询有没有这个user
    var user = new User({});

    
    user.findByName(req.body.username, function(err, cb){
        if(err) {
            console.log('DB:' + err);
            res.send({status: 'success', message: 'true'});
        }
        else {
            if(cb.length != 0){
                res.send({status: 'success', message: 'false'});
            }
            else {                
                res.send({status: 'success', message: 'true'});
            }
        }
    });
   
});

module.exports = routers; 