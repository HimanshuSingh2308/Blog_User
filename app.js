var express       =require('express');
	body          =require('body-parser');
	db            =require('mongoose');
	methodOverride=require('method-override');
	expressSanitiz=require('express-sanitizer');
    app           =express();
    str=require('format-title'),
    comment=require('./models/comments');
app.set('view engine','ejs');
app.use(body.urlencoded({extended:true}));
app.use(expressSanitiz());
app.use(express.static('files'));
app.use(methodOverride("_method"));
//  db.connect("mongodb://localhost/Blog");// local database
db.connect("mongodb://devil:himanshu@ds159033.mlab.com:59033/blogs");//using mlabs database

var blogSchema=new db.Schema({
	title:String,
	Image:String,
	body:String,
	comments:[{
		type:db.Schema.Types.ObjectId,
		ref:"comment"
	}],
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
		blog.findById(id).populate("comments").exec(function(error,blog)
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
	req.body.blog.body=req.sanitize(req.body.blog.body);
	blog.findById(id,function(error,blogs){
			if (error) 
			{
				console.log(error);
			}
			else
			{
				blogs.likes+=1;
				blog.save(function(error,blog){
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

app.post('/blog/:id/comments',function(req,res){
	var id=req.params.id;
	var content=str.capWords(req.body.comment);
	comment.create(
		{
			content:content
		},function(error,comment){
			if (error) 
			{
				console.log(error);
			}
			else
			{
				blog.findById(id,function(error,posts)
				{
					if(error)
					{
						console.log(error);
					}
					else
					{
						posts.comments.push(comment);
					    posts.save(function(error,content)
				        {
			                if(error)
			                {
			                    console.log(error);
			                }
			                else{
			                	res.redirect(`/blog/${id}`);
			                }
			            });
					}
				});
			}
	});
});




const port=process.env.PORT||3000;
app.listen(port,function(){
	console.log('Server Started!!');
});