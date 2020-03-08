var express = require('express');
var routers = express.Router();
var formidable = require('formidable');
var fs =  require('fs');
var moment = require('moment');

routers.get('/', function(req, res, next){

});

routers.post('/', function(req, res, next){
  let form = new formidable.IncomingForm();
  let dir = './public/assets/i/upload/';

  form.uploadDir = dir;
  form.parse(req, function(err, fields, files){
    let oldPath = files.myFile.path;
    let picname = files.myFile.name;

    // let picname = moment(new Date()).format('YYYYMMDDHHmmss').toString();
    
    let newPath = dir + picname;
    // console.log(__dirname);
    // let bitpic = fs.readFileSync(oldPath);
    // let base64pic =  Buffer.from(bitpic, "binary").toString("base64");
    // console.log(base64pic);

    // //del temp pic from server
    // let abPath = __dirname.substring(0,13) + oldPath; 
    // fs.unlinkSync(abPath);
    
    fs.rename(oldPath, newPath, function(err){
      if(err){
        res.send({isOK: false, err});
      }
      let resPath = newPath.replace("./public", "http://localhost:3000");
      res.send({isOK: true, url: [resPath]});
    
    });

    // res.send({isOK: true, url: ["data:image/jpg;base64," + base64pic]});
    
  })
});

module.exports = routers; 