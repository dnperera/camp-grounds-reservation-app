var express = require('express');
var router = express.Router();
var CampGround = require('../models/campground');

//Index route - display all camp grounds
router.get('/',function(req,res){
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
router.post('/',isLoggedIn,function(req,res){
	//get data from form and campground object
	var newCampGround ={
		name: req.body.name,
		image: req.body.image,
		description: req.body.description,
		author : {
			id: req.user._id,
			username: req.user.username
		}
	};

	CampGround.create( newCampGround, function( error, newCamp){
		if( error ) {
			console.log(error);
		}else {
			
			//redirect back to camp ground page
			res.redirect("/camp-grounds")
			console.log(newCamp);
		}
	});
});

// Display the form  to create  new campground
router.get('/new',isLoggedIn,function(req,res) {
	res.render('campgrounds/new')
});

//Display details of the selected campground
router.get('/:id',function( req,res) {
	//get selected campground details with comments
	CampGround.findById(req.params.id).populate("comments").exec( function ( error ,data) {
		if( error) {
			console.log(error);
		}else {
			res.render('campgrounds/show',{campground:data});
		}
	});
});

//Edit Camp Ground
router.get('/:id/edit', function( req,res ) {
	CampGround.findById(req.params.id,function( error, foundCampGround ){
		if( error) {
			console.log(error);
			res.redirect("/camp-grounds");
		} else {
			res.render('campgrounds/edit',{campground:foundCampGround});
		}
	})
});

//Update Camp Ground
router.put('/:id',function( req,res ){
	//find and update the correct campground.
	CampGround.findByIdAndUpdate(req.params.id,req.body.campground,function( error, foundCampGround ){
		if( error ) {
			console.log(error);
			res.redirect("/camp-grounds");
		}else{
			res.redirect("/camp-grounds/"+req.params.id);
		}
	});
});

function isLoggedIn( req, res , next) {
	if( req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login")
}
module.exports = router;