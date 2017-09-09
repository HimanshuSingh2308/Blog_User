var express       =require('express');
	body          =require('body-parser');
	db            =require('mongoose');
	methodOverride=require('method-override');
	expressSanitiz=require('express-sanitizer');
    app           =express();
app.set('view engine','ejs');
app.use(body.urlencoded({extended:true}));
app.use(expressSanitiz());
app.use(express.static('files'));
app.use(methodOverride("_method"));
db.connect("mongodb://localhost/Blog");
// db.connect("mongodb://username:password@ds159033.mlab.com:59033/blogs"); using mlabs database

var blogSchema=new db.Schema({
	title:String,
	Image:String,
	body:String,
	like:{type:Boolean,default:false},
	likes:{type:Number,default:0},
	date:{type:Date,default:Date.now}
});
var blog=db.model('blog',blogSchema);


app.get('/',function(req,res){
	res.redirect('/blog');
});


app.get('/blog',function(req,res){
	blog.find({},function(error,blogs){
		if(error)
		{	
			console.log(error);
		}
		else
		{
			res.render('home',{blogs:blogs});;	
		}
	});	
});


app.get('/blog/profile',function(req,res){
	res.render('profile');
});


app.post('/blog',function(req,res){
	var name=req.body.title;
	var url=req.body.imageurl;
	var desc=req.body.body;
	desc=req.sanitize(desc);
	blog.create(
		{
			title:name,
			Image:url,
			body:desc
		},function(error,blog){
			if (error) 
			{
				console.log(error);
			}
			else
			{
				res.redirect('/');
			}
		});
});


app.get('/blog/:id',function(req,res){
		var id=req.params.id;
		blog.findById(id,function(error,blog)
		{
			if(error)
			{
				console.log(error);
			}
			else
			{
				res.render('show',{blog:blog})
			}
		});
});


// app.get('/blog/:id/edit',function(req,res){
// 	var id=req.params.id;
// 		blog.findById(id,function(error,blog)
// 		{
// 			if(error)
// 			{
// 				console.log(error);
// 			}
// 			else
// 			{
// 				res.render('edit',{blog:blog})
// 			}
// 		});
// });


app.put('/blog/:id',function(req,res){
	var id=req.params.id;
	// req.body.blog.body=req.sanitize(req.body.blog.body);
	// console.log(req.body.blog.body);
	blog.findById(id,function(error,blogs){
			if (error) 
			{
				console.log(error);
			}
			else
			{
				blogs.like=!blogs.like;
				blogs.likes+=1;
				blog.findByIdAndUpdate(id,blogs,function(error,blog){
					if (error) 
					{
						console.log(error);
					}
					else{
							res.redirect("back");
					}	
				});
			}
		});
});


// app.delete('/blog/:id',function(req,res){
// 	var id=req.params.id;
// 	blog.findByIdAndRemove(id,function(error,blog){
// 			if (error) 
// 			{
// 				console.log(error);
// 			}
// 			else
// 			{
// 				console.log(req.body.blog);
// 				res.redirect('/');
// 			}
// 		});
// });

const port=process.env.PORT||3000;
app.listen(port,function(){
	console.log('Server Started!!');
});;