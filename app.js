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
			res.render("camp-grounds",{campGrounds:[]});
			console.log(error);
		}
		res.render("index",{campGrounds:data})
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
	res.render('add-camp')
});

//Display details of the selected campground
app.get('/camp-grounds/:id',function( req,res) {
	//get selected campground details with comments
	CampGround.findById(req.params.id).populate("comments").exec( function ( error ,data) {
		if( error) {
			console.log(error);
		}else {
			res.render('show',{campground:data});
		}
	});
});

app.listen(port,ip,() => {
	console.log(`Server started listening on port ${port}`);
});