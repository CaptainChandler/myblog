var express = require('express');
var routers = express.Router();
var Blog = require('../model/blog');
var moment = require('moment');


routers.get('/', function(req, res, next){
  let subjectid = req.query.subjectid;
  var blog = new Blog({});

  var detail = [];
  
  req.session.subjectid = subjectid;

  blog.getBySubjectid(subjectid, function(err, rtn){

    if(err){
      console.log('DB:there has been a error, refer info as below ' + err);
    }
    else{

      detail.subject = rtn[0].subject;
      detail.postbody = rtn[0].postbody;
    
      req.session.detail = detail;
      res.render('updblog', {title: '我的主页'});
    }
  });
});


routers.post('/', function(req, res, next) {

  let postbody = req.body.postbody;
  let subjectid = req.session.subjectid;

  let updtime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

  let flg = false;

  var strUpd = {
    postbody: postbody,
    utime: updtime
  }

  // console.log(strUpd);

  function doSave(){
    return new Promise(function(solve){
      Blog.update({subjectid: subjectid}, {$set: strUpd}, 
        function(err){
          if(err){
            flg = false;
          } 
          else {
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