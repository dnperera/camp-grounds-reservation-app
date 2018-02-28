var Comment = require('../models/comment');
var CampGround = require('../models/campground');

var middlewareObj = {};

middlewareObj.checkCampGroundOwnerShip = function( req, res, next ){
	if( req.isAuthenticated()){		
		CampGround.findById(req.params.id,function( error, foundCampGround ){
			if( error) {
				console.log(error);
				res.redirect("back");
			} else {
				//does user own the listing
				if(foundCampGround.author.id.equals(req.user._id)){
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

middlewareObj.checkCommentOwnerShip = function ( req, res, next ){
	if( req.isAuthenticated()){		
		Comment.findById(req.params.comment_id,function( error, foundComment ){
			if( error) {
				console.log(error);
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
	res.redirect("/login")
};

module.exports = middlewareObj;