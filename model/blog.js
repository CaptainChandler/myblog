var mongoose = require('../routes/db.js');
var Schema = mongoose.Schema;

var BlogSchema = new Schema({
    subjectid: {type: String},  
    subject: {type: String},
    author: {type: String},
    postbody: {type: String},
    visible: {type: Number},        //1:可见 0:隐藏(针对访客)
    valid: {type: Number},          //1:可见 0:隐藏(针对自己)
    ctime: {type: Date},            //register time
    utime: {type: Date}             //updated time
});
    
BlogSchema.methods.getAmount = function (strSearch, cb) {
    
    return this.model("blogs").find(strSearch).count(cb);
}

// 查找数据，找到所有数据。args是个对象{"pageamount":2,"page":page}
BlogSchema.methods.findByAuthor = function (json, C, D) {
    var result = [];  // 结果数组    
    if(arguments.length == 2){
        var callback = C;
        var skipnumber = 0;
        var limit = 0;
    }
    else if(arguments.length == 3){
        var callback = D;
        var args = C;
        // 应该省略的条数
        var skipnumber = args.pageamount * args.page || 0;
        // 数目限制
        var limit = args.pageamount || 0;

        //排序方式
        var sort = args.sort || "";
    }  
  
    //连接数据库，连接之后查找所有    
    // var cursor = this.model("blogs").find(json).skip(skipnumber).limit(limit).sort(sort);
    return this.model("blogs").find(json, {}, {skip: skipnumber, limit: limit, sort: sort}, callback);
    }

  BlogSchema.methods.listupByAuthor = function(strSearch, cb){
      return this.model('blogs').find(strSearch,  {}, {sort: {ctime:-1}}, cb);
  }

  BlogSchema.methods.getBySubjectid = function(subjectid, cb){
    return this.model('blogs').find({subjectid:subjectid}, cb);
}


module.exports = mongoose.model('blogs', BlogSchema)