var express = require('express');
var routers = express.Router();
var Blog = require('../model/blog');
var moment = require('moment');

routers.get('/', function(req, res, next) {

  let subjectid = req.query.subjectid;
  let visible = req.query.visible;

  let updtime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

  let flg = false;

  var strUpd = {
    utime: updtime,
    visible: visible
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
      res.render('bloglist',{title:"我的文章", username:req.session.showname});
    }
  }

  doRender();
  
});

module.exports = routers; 