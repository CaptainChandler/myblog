var express = require('express');
var routers = express.Router();
var Blog = require('../model/blog');
var Moment = require('moment');

routers.get('/', function(req, res, next) {
    
  if(req.session.showname) {
      res.render('bloglist', {title: '我的文章'});
    }
    else {
      res.render('login', { title: '登录' }); 
    }
});

routers.post('/getArticles', function(req, res, next) {

  var blog = new Blog({});
  console.log(req.session.username);
  let strSearch = {author: req.session.username, valid: 1};
  blog.listupByAuthor(strSearch, function(err, rtn){
    
    if(err){
      console.log('DB:there has been a error, refer info as below ' + err);
    }
    else{
      console.log('blog list read sucessfully');
      
      // for(let idx=0; idx<rtn.length; idx++){
      //   let posttime = Moment(rtn[idx].ctime).format('YYYY-MM-DD HH:mm:ss');
      //   rtn[idx].ctime = posttime;
      //   console.log(posttime);
      // }

      res.json({status: 'success', message: 'false', result: rtn});
    }

  });    

});

module.exports = routers; 