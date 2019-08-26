var express = require('express');
var routers = express.Router();
var Blog = require('../model/blog');
var moment = require('moment');

routers.get('/', function(req, res, next) {

    res.render('compose', {title: '写文章', username: req.session.showname});
});


routers.post('/', function(req, res, next) {

  var subject = req.body.subject;
  var postbody = req.body.postbody;

  var posttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  var id = moment(id).format('YYYYMMDDHHmmss');

  var flg = true;

  var blog = new Blog({
    subjectid: id,
    subject: subject,
    author: req.session.username,
    postbody: postbody,
    visible: 1,
    valid: 1,
    ctime: posttime,
    utime: posttime,
  })

  function doSave(){
    return new Promise(function(solve){
      blog.save(function(err, rtn){
        if(err){
          console.log('DB:there has been a error, refer info as below' + err);
          flg = false;
        }
        else{
          console.log('DB:blog saved sucessfully');
          flg = true;
          solve();
        }
      });    
    });
  } 

  async function doRender(){
    await doSave();

    if(flg){
      res.render('bloglist',{title:"我的文章", username:req.session.showname});
    }
    else{
      res.render('compose',{title:"写文章", username:req.session.showname});
    }
  }

  doRender();
  
});


module.exports = routers; 