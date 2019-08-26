var express = require('express');
var routers = express.Router();
var Comments = require('../model/comments');
var moment = require('moment');

routers.post('/comment', function(req, res, next) {
    var subjectid = req.query.subjectid;

    var comments = new Comments({});

    comments.findBySubject(subjectid, function(err, rtn){
      if(err){
        console.log("DB:there has been a error, refer info as below " + err);
      }
      else{
        res.send({status: "sucess", result: rtn});
      }
    })
});

routers.post('/postComment', function(req, res, next) {

  var subjectid = req.session.subjectid;
  var username = req.session.username;
  var commentbody = req.body.commentbody;

  var posttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  var commentid = moment(posttime).format('YYYYMMDDHHmmss');

  var flg = true;

  var comments = new Comments({
    subjectid: subjectid,
    commentid: commentid,
    commentuser: username,
    commentbody: commentbody,
    ctime: posttime
  })

  function doSave(){
    return new Promise(function(solve){
      comments.save(function(err, rtn){
        if(err){
          console.log('DB:there has been a error, refer info as below' + err);
          flg = false;
        }
        else{
          console.log('DB:comment saved sucessfully');
          flg = true;
          solve();
        }
      });    
    });
  } 

  async function doRender(){
    await doSave();

    if(flg){
      res.send({status: "success"});
    }
    else{
      res.redirect('/myblog/getArticle');
    }
  }

  doRender();
  
});

routers.post('/getCommentAmount', function(req, res, next){
  var comments = new Comments({});

  comments.getAmountBySubject(req.query.subjectid, function(err, rtn){
    if(err){
      console.log('DB:there has been a error, refer info as below ' + err);
    }
    else{
      res.send(rtn.toString());
    }
  })
});


module.exports = routers; 