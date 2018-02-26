var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var CampGround = require('./models/campground');
var Comment = require('./models/comment');
//var User = require('./models/user');
var seedDB = require("./seeds");

//seedDB();
//connect or create  mongo db 'camp_grounds'
mongoose.connect('mongodb://localhost/camp_grounds');

var port = process.env.PORT || 3000;
var ip = process.env.IP || '127.0.0.1';

app.use(bodyParser.urlencoded({extended:true}));

//set the path for the static assets
app.use(express.static("public"));

//set the view Engine
app.set("view engine","ejs");

app.get('/',function(req,res) {
	res.render("landing")
});

//Index route - display all camp grounds
app.get('/camp-grounds',function(req,res){
	//Get all camp grounds from DB
	CampGround.find({} ,function( error, data){
		if(error) {
			res.render("campgrounds/index",{campGrounds:[]});
			console.log(error);
		}
		res.render("campgrounds/index",{campGrounds:data})
	});
});

//Create new campground
app.post('/camp-grounds',function(req,res){
	CampGround.create(req.body, function( error, data){
		if( error ) {
			console.log(error);
		}else {
			//redirect back to camp ground page
			res.redirect("/camp-grounds")
			console.log(data);
		}
	});
});

// Display the form  to create  new campground
app.get('/camp-grounds/new',function(req,res) {
	res.render('campgrounds/new')
});

//Display details of the selected campground
app.get('/camp-grounds/:id',function( req,res) {
	//get selected campground details with comments
	CampGround.findById(req.params.id).populate("comments").exec( function ( error ,data) {
		if( error) {
			console.log(error);
		}else {
			res.render('campgrounds/show',{campground:data});
		}
	});
});

/* ----------------------------
 User comments Routes 
 -----------------------------
 */
app.get('/camp-grounds/:id/comments/new',function( req ,res ) {
	//find campground by id
	CampGround.findById(req.params.id,function( error , campground ){
		if(error) {
			console.log(error);
		} else {
			res.render( 'comments/new',{campground:campground});
		}
	})
});

app.post('/camp-grounds/:id/comments/', function (req, res ){
 //find campground by id
 CampGround.findById(req.params.id,function( error , campground ){
 	if( error ) {
 		console.log(error);
 		res.redirect('/camp-grounds')
 	} else {
 		Comment.create(req.body.comment, function( error,comment ){
 			if(error) {
 				console.log(error);
 			}else{
 				campground.comments.push(comment._id);
 				campground.save();
 				res.redirect('/camp-grounds/'+campground._id);
 			}
 		});
 	}
 })

});

app.listen(port,ip,() => {
	console.log(`Server started listening on port ${port}`);
});