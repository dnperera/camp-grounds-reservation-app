var express = require('express');
var router = express.Router({mergeParams:true});
var Comment = require('../models/comment');
var CampGround = require('../models/campground');
var middleware = require('../middleware');
//Comments new
router.get('/new',middleware.isLoggedIn,function( req ,res ) {
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
router.post('/',middleware.isLoggedIn, function (req, res ){
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
 				req.flash("success","Your comment added successfully!.")
 				res.redirect('/camp-grounds/'+campground._id);
 			}
 		});
 	}
 })

});

// Edit comment route
router.get('/:comment_id/edit',middleware.checkCommentOwnerShip,function( req,res ){
	CampGround.findById(req.params.id, function( error ,foundCampground) {
		if( error || !foundCampground ) {
			req.flash( "error", "No campground found !!!")
			return res.redirect('/camp-grounds/');
		}
		Comment.findById(req.params.comment_id,function(error ,foundComment ){
			if( error ) {
				console.log(error);
				res.redirect('back');
			} else {
				res.render('comments/edit',{campgroundId:req.params.id ,comment:foundComment});
			}
		})
	});

});

//Update comment route
router.put('/:comment_id',middleware.checkCommentOwnerShip,function( req,res ){

	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function( error, updatedComment ){
		if( error ) {
			console.log(error);
			res.redirect('back');
		} else {
			req.flash("success", "Your comment updated!.")
			res.redirect('/camp-grounds/'+req.params.id);
		}
	});
});

//delete comment
router.delete('/:comment_id',middleware.checkCommentOwnerShip,function(req,res) {
	Comment.findByIdAndRemove(req.params.comment_id,function( error ){
		if(error) {
			console.log(error);
			res.redirect('back');
		} else {
			req.flash("error", "Selected comment deleted!.")
			res.redirect('/camp-grounds/'+req.params.id);
		}
	});
});

module.exports = router;