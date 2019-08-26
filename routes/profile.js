var express = require('express');
var routers = express.Router();
var Profile = require('../model/profile');

routers.get('/', function(req, res, next) {

    var p = new Profile({});
    var flg = true;
    var arr = [];

    function getProfile(){
        return new Promise(function(solve){
            p.findByName(req.session.username, function(err, rtn){
                if(err){
                    console.log('DB:get profile of username error, refer info as below:');
                    flg = false;
                }
                else{
                    solve();
                    flg = true;
                    // console.log(rtn);
                    arr = rtn;                                       
                }
            });
        });
    }

    async function doRender(){
        await getProfile();

        if(flg){
           
            var profile = {};
            profile.domainname = arr[0].domainname;
            profile.blogname = arr[0].blogname;
            profile.useremail = arr[0].email;
            profile.userqq = arr[0].QQ;
            profile.userphone = arr[0].tel;
            profile.userweibo = arr[0].other;
            profile.userintro = arr[0].selfintro;

            req.session.profile = profile;            
            req.session.domainname = arr[0].domainname; 

            if(arr[0].domainname){
                editable = 'disabled="disabled"';
            } else{
                editable = '';
            }
            res.render('profile', {title: '个人资料', editable: editable});
        }
        else {
            res.render('login', { title: '登录' }); 
          }
    }

    doRender();
    
});

routers.post('/ifDomainExists', function(req, res, next){
    var domainname = req.body.domainname;
    var profile = new Profile({});

    profile.findByDomain(domainname, function(err, rtn){
        if(err){
            console.log('【routers/profile.js】-[DB]：there has been a error, refer info as below ' + err);
        } else {
           if(rtn.length > 0) {
               res.send({status: "success", result: {flg: "1"}});
           } 
           else{
            res.send({status: "success", result: {flg: "0"}});
           }
        }
    });

});

routers.post('/', function(req, res, next){
    var strUpd = {};
    // if(req.body.domainname){
    //     strUpd={domainname:req.body.domainname,
    //         blogname:req.body.blogname,
    //         nickname: req.body.username, 
    //         email: req.body.useremail,
    //         tel: req.body.userphone,
    //         other: req.body.userweibo,
    //         selfintro: req.body.userintro}
    // }
    // else{
    //     strUpd={
    //         blogname:req.body.blogname,
    //         nickname: req.body.username, 
    //         email: req.body.useremail,
    //         tel: req.body.userphone,
    //         other: req.body.userweibo,
    //         selfintro: req.body.userintro}
    // }
    
    strUpd={domainname:req.body.bkfordomainname,
                blogname:req.body.blogname,
                nickname: req.body.username, 
                email: req.body.useremail,
                tel: req.body.userphone,
                other: req.body.userweibo,
                selfintro: req.body.userintro}

    Profile.update({username: req.session.username}, 
        {$set:strUpd}, function(err){
                    if(err){
                        console.log('DB:' + req.session.username + 'Update error');
                    }
                    else{
                        console.log('DB:' + req.session.username + 'Update success');
                        
                        if(req.body.username != req.session.nickname){
                            req.session.nickname = req.body.username;
                            if(req.body.username === ""){
                                req.session.showname = req.session.username;
                            }
                            else{
                                req.session.showname = req.body.username;    
                            }
                        }  

                        var profile = {};

                        profile.domainname = req.body.bkfordomainname;                        
                        profile.blogname = req.body.blogname;
                        profile.useremail = req.body.useremail;
                        profile.userphone = req.body.userphone;
                        profile.userweibo = req.body.userweibo;
                        profile.userintro = req.body.userintro;

                        req.session.profile = profile;
                        req.session.domainname = req.body.bkfordomainname; 

                        if(profile.domainname.trim() === ''){
                            editable = '';
                        } else{
                            editable = 'disabled="disabled"';
                        }
                        res.render('profile', {title: '个人资料', editable: editable});
                    }
                })
});

module.exports = routers; 