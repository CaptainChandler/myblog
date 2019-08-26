var mongoose = require('../routes/db.js');
var Schema = mongoose.Schema;

var ProfileSchema = new Schema({
    domainname: {type: String},
    blogname: {type: String},
    username: {type: String},
    nickname: {type: String},   
    email: {type: String},  
    tel: {type: String},  
    other: {type: String},  
    selfintro: {type: String},  
    ctime: {type: Date},
    utime: {type: Date}            //user info updated time
});

ProfileSchema.methods.findByName = function(username, cb){
    return this.model("profiles").find({username: username}, cb);
}

ProfileSchema.methods.findByDomain = function(domainname, cb){
    return this.model("profiles").find({domainname: domainname}, cb);
}


module.exports = mongoose.model('profiles', ProfileSchema)