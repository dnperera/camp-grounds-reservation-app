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
router.post('/',function(req,res){
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
router.get('/new',function(req,res) {
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

module.exports = router;