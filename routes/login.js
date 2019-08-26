var express = require('express');
var routers = express.Router();
var User = require('../model/user');
var Profile = require('../model/profile');

routers.get('/', function(req, res, next) {
    res.render('login', {title: '登录'});
});

routers.post('/', function(req, res, next) {
    
    var ctime = new Date();
    var flg = false;
    var flgP = false;

    var nickname = "";
    let domainname = "";

    var user =  new User({});
    var profile =  new Profile({});
    
    function doFind(){
        return new Promise(function(resolve){
            
            user.findByName(req.body.username, function(err, rtn){
                if(err){
                    console.log("DB:" + err);
                    flg = false;                    
                }
                else{
                    console.log("user has been found:" + rtn);
                    flg = true;
                    resolve();
                }
            });
        });        
    };

    function doFindProfile(){
        return new Promise(function(resolve){
            
            profile.findByName(req.body.username, function(err, rtn){
                if(err){
                    console.log("DB:" + err);
                    flgP = false;                    
                }
                else{
                    
                    resolve(); 
                    
                    if(rtn.length === 0){
                        console.log("user's profile has not been found:" + rtn);  
                        flgP = false;  
                        nickname = "";
                    }
                    else{
                        console.log("user's profile has been found:" + rtn);  
                        if(rtn[0].nickname != "") {
                            nickname = rtn[0].nickname;    
                        }   
                        else{
                            nickname = "";
                        }  

                        if(rtn[0].domainname != "") {
                            domainname = rtn[0].domainname;    
                        }   
                        else{
                            domainname = "";
                        } 
                        flgP = true;  
                    }                                                       
                }                
            });
        });        
    };

    async function doRender(){
        await doFind();
        
        if(flg === false){
            res.render('login', {title: '登录失败'});
        } else {

            await doFindProfile();
            if(flgP === false){
                req.session.username = "";
                req.session.nickname = "";
                req.session.mydomainname = "";
                req.session.domainname = "";
                req.session.login = "0";
                // req.session.domainname = "";
                res.render('login', {title: '登录失败'});
            }
            else{
                req.session.username = req.body.username
                req.session.nickname = nickname;
                req.session.mydomainname = domainname; 
                req.session.domainname = domainname;
                // req.session.domainname = domainname;
                req.session.login = "1";
                
                if(req.session.nickname === "") {
                    req.session.showname= req.session.username;
                }
                else{
                    req.session.showname= req.session.nickname;                    
                }

                res.render('welcome', {title: '登录成功', message: req.session.showname + '，欢迎回来~'});                
            }            
        }
    };

    doRender();
});


module.exports = routers; 