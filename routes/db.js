var mongoose = require('mongoose');
var DB_URL = 'mongodb://localhost/mypage';

mongoose.connect(DB_URL);

var db = mongoose.connection;

db.on('connected', function() {
    console.log('DB:connected to my page');
});

db.on('disconnected', function(){
    console.log('DB:disconnected from mypage database');
});

db.on('error', function(err){
    console.log('DB:there has been a error [' + err + ']');
});

module.exports = mongoose;