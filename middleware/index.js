var Comment = require('../models/comment');
var CampGround = require('../models/campground');

var middlewareObj = {};

middlewareObj.checkCampGroundOwnerShip = function( req, res, next ){
	if( req.isAuthenticated()){		
		CampGround.findById(req.params.id,function( error, foundCampGround ){
			if( !foundCampGround || error) {
				console.log(error);
				req.flash("error", "Campground not found.")
				res.redirect("back");
			} else {
				//does user own the listing
				if(foundCampGround.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You are not authorised!.")
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in!.")
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnerShip = function ( req, res, next ){
	if( req.isAuthenticated()){		
		Comment.findById(req.params.comment_id,function( error, foundComment ){
			if( error || !foundComment) {
				console.log(error);
				req.flash("error","Comment not found!");
				res.redirect("back");
			} else {
				//does user own the listing
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function ( req, res , next) {
	if( req.isAuthenticated()) {
		return next();
	}
	req.flash("error","You need to be logged in to access!.");
	res.redirect("/login")
};

module.exports = middlewareObj;