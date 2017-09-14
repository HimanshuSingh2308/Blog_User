var db=require('mongoose');
var commentSchema=new db.Schema({
	content:String,
	date:{type:Date,default:Date.now}
});

module.exports=db.model('comment',commentSchema);