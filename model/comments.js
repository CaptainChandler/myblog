var mongoose = require('../routes/db.js');
var Schema = mongoose.Schema;

var CommentsSchema = new Schema({
    subjectid: {type: String}, 
    commentid: {type: String},  
    commentuser: {type: String},
    commentbody: {type: String},
    ctime: {type: Date}            //register time
});
    
CommentsSchema.methods.getAmountBySubject= function(subjectid, cb){
    // return this.model('comments').where({"subjectid": subjectid}).estimatedDocumentCount(cb);
    return this.model('comments').find({"subjectid": subjectid}).count(cb);
}

CommentsSchema.methods.findBySubject = function(subjectid, cb){
    return this.model('comments').find({"subjectid": subjectid}, {}, {sort: {ctime:-1}}, cb);
}

module.exports = mongoose.model('comments', CommentsSchema)