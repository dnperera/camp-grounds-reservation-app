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
 				//add username and id to new comment
 				comment.author.id = req.user._id;
 				comment.author.username = req.user.username;
 				//save comment
 				comment.save();
 				campground.comments.push(comment._id);
 				campground.save();
 				res.redirect('/camp-grounds/'+campground._id);
 			}
 		});
 	}
 })

});

// Edit comment route
router.get('/:comment_id/edit',function( req,res ){
	Comment.findById(req.params.comment_id,function(error ,foundComment ){
		if( error ) {
			console.log(error);
			res.redirect('back');
		} else {
			res.render('comments/edit',{campgroundId:req.params.id ,comment:foundComment});
		}
	})
});

//Update comment route
router.put('/:comment_id',function( req,res ){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function( error, updatedComment ){
		if( error ) {
			console.log(error);
			res.redirect('back');
		} else {
			res.redirect('/camp-grounds/'+req.params.id);
		}
	});
});

//delete comment
router.delete('/:comment_id',function(req,res) {
	Comment.findByIdAndRemove(req.params.comment_id,function( error ){
		if(error) {
			console.log(error);
			res.redirect('back');
		} else {
			res.redirect('/camp-grounds/'+req.params.id);
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