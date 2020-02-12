var express = require('express');
var routers = express.Router();
var Blog = require('../model/blog');
var Comments = require('../model/comments');
var moment = require('moment');

routers.get('/', function(req, res, next){
  var blog = new Blog({});
  var comments = new Comments({});
  var subjectid = req.query.subjectid;
  var detail = [];
  
  req.session.subjectid = subjectid;

  blog.getBySubjectid(subjectid, function(err, rtn){

    if(err){
      console.log('DB:there has been a error, refer info as below ' + err);
    }
    else{

      // comments.getAmountBySubject(subjectid, function(err, cnt){
      //   detail.commentamount = cnt.toString();
      // });

      detail.subject = rtn[0].subject;
      // detail.subjectid = rtn[0].subjectid;
      detail.postbody = rtn[0].postbody.replace(/<p>/g, "<p style='white-space:pre-wrap;word-wrap:break-word; '>");
      detail.author = rtn[0].author;
      detail.ctime = moment(rtn[0].ctime).format("YYYY-MM-DD hh:mm:ss");
      detail.visible = rtn[0].visible;


      req.session.detail = detail;
      res.render('blogdetail', {title: '我的主页'});
    }
  });

});

module.exports = routers; 