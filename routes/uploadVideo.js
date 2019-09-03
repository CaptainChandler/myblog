var express = require('express');
var routers = express.Router();
var formidable = require('formidable');
var fs =  require('fs');

routers.get('/', function(req, res, next){

});


routers.post('/', function(req, res, next){
  let form = new formidable.IncomingForm();
  let dir = './public/assets/v/upload/';

  form.uploadDir = dir;
  form.parse(req, function(err, fields, files){
    let oldPath = files.myFile.path;
    let picname = files.myFile.name;

    let newPath = dir + picname;
    fs.rename(oldPath, newPath, function(err){
      if(err){
        res.send({isOK: false, err});
      }
      let resPath = newPath.replace("./public", "http://localhost:3000");
      res.send({isOK: true, url: [resPath]});
    });
  })
});

module.exports = routers; 