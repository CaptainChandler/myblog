var mongoose = require('../routes/db.js');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String},
    password: {type: String},
    ctime: {type: Date},            //register time
    last_logintime: {type: Date},   //last login time
    utime: {type: Date}            //user info updated time
});

UserSchema.methods.findAll = function(cb){
    return this.model('users').find(cb);
};

UserSchema.methods.findByName = function(name, cb){
    return this.model('users').find({username: name}, cb);
};

    

module.exports = mongoose.model('users', UserSchema)