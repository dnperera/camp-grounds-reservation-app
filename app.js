var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var sessions = require('express-session');
var CampGround = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');

//seedDB();
//connect or create  mongo db 'camp_grounds'
mongoose.connect('mongodb://localhost/camp_grounds');

var port = process.env.PORT || 3000;
var ip = process.env.IP || '127.0.0.1';

(app.use(bodyParser.urlencoded({extended:true})));

//set the path for the static assets
app.use(express.static(__dirname+"/public"));

//set the view Engine
app.set("view engine","ejs");

//--- Set up Passport Configurations
app.use(sessions({
	secret:"Madola Multi Plantation,Sri Lanka",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy( User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//add current user object to the express middle ware
app.use( function ( req, res, next ){
	res.locals.currentUser = req.user;
	next();
})

//--- End Passport set up ----

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
		res.render("campgrounds/index",{campGrounds:data, currentUser:req.user})
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
app.get('/camp-grounds/:id/comments/new',isLoggedIn,function( req ,res ) {
	//find campground by id
	CampGround.findById(req.params.id,function( error , campground ){
		if(error) {
			console.log(error);
		} else {
			res.render( 'comments/new',{campground:campground});
		}
	})
});

app.post('/camp-grounds/:id/comments/',isLoggedIn, function (req, res ){
 //find campground by id
 CampGround.findById(req.params.id,function( error , campground ){
 	if( error ) {
 		console.log(error);
 		res.redirect('/camp-grounds')
 	} else {
 		//create comment
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

/*
	Authincation Routes
 */

app.get( '/register',function ( req,res ){
	res.render('register');
});

app.post('/register',function( req,res ){
	var newUser = new User({username:req.body.username});
	User.register(newUser,req.body.password,function(error ,newUser){
		if(error) {
			console.log(error);
			return res.render('register');
		}
		passport.authenticate("local")(req,res, function(){
			res.redirect('/camp-grounds');
		});
	})

});

//show login page
app.get('/login',function( req, res ) {
	res.render('login');
});

//authenticate login details
app.post('/login',passport.authenticate("local",
	{
		successRedirect: "/camp-grounds",
		failureRedirect: "/login"
	}),function(req, res ) {
});

app.get('/logout',function( req,res ){
	req.logout();
	res.redirect("/");
});
//--- End Authincation Routes

app.listen(port,ip,() => {
	console.log(`Server started listening on port ${port}`);
});

function isLoggedIn( req, res , next) {
	if( req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login")
}