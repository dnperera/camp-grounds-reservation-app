var express = require('express');
var router = express.Router({mergeParams:true});
var Comment = require('../models/comment');
var CampGround = require('../models/campground');

//Comments new
router.get('/new',isLoggedIn,function( req ,res ) {
	//find campground by id
	CampGround.findById(req.params.id,function( error , campground ){
		if(error) {
			console.log(error);
		} else {
			res.render( 'comments/new',{campground:campground});
		}
	})
});

//Comments create
router.post('/',isLoggedIn, function (req, res ){
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

function isLoggedIn( req, res , next) {
	if( req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login")
}

module.exports = router;