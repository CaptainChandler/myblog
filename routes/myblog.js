var express = require('express');
var routers = express.Router();
var Blog = require('../model/blog');
var Profile = require('../model/profile');

routers.get('/', function(req, res, next) {    
  let domainname = req.query.blogname;  
  req.session.domainname = domainname;

  var profile = new Profile({});

  //查找blogname对应的username
  profile.findByDomain(domainname, function(err, rtn){
    if(err){
      // res.render('err');
    }else{
      if(rtn.length === 0){
        console.log("域名不存在");
        req.session.accessor = '';
        // res.render('err');
      } else {
        req.session.accessor = rtn[0].username;
        req.session.blogname = rtn[0].blogname;
        req.session.selfintro = rtn[0].selfintro;
        res.render('myblog', {title: '我的主页'});   
      }
      
    }
  })
});


routers.post('/getallarticles', function(req, res, next) {   
  var username = req.session.accessor;
  var blog = new Blog({});  

  // 这个页面接收一个参数，页面
  var page = req.query.page;


  let strSearch;

  if(req.session.mydomainname === req.session.domainname && req.session.login === "1") {
    strSearch = {author: username, 
                valid:1}  
  }
  else {
    strSearch = {author: username, 
                visible: 1,
                valid:1}  
  }

  blog.findByAuthor(strSearch, {"pageamount":5, "page": page, "sort":{"ctime":-1}}, (err, rnt) => {
     if(err){
        console.log('DB:there has been a error,refer info as below ' + err);
     }
     else{
      res.send({status: 'success', result: rnt});
     }
  });    
     
});


routers.post('/getAmount', function(req, res, next) {   
  var blog = new Blog({});

  var username = req.session.accessor;

  let strSearch;

  if(req.session.mydomainname === req.session.domainname) {
    strSearch = {author: username, 
                valid:1}  
  }
  else {
    strSearch = {author: username, 
                visible: 1,
                valid:1}  
  }

  //取得当前用户名的所有文章数目
  blog.getAmount(strSearch, function(err, rtn){
      if(err){
        console.log("DB:there has been a error, refer info as below " + err);
        
      }
      else{
        res.send(rtn.toString());
      }
  });
     
});


module.exports = routers; 