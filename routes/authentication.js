var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get( '/register',function ( req,res ){
	res.render('register');
});

router.post('/register',function( req,res ){
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
router.get('/login',function( req, res ) {
	res.render('login');
});

//authenticate login details
router.post('/login',passport.authenticate("local",
	{
		successRedirect: "/camp-grounds",
		failureRedirect: "/login"
	}),function(req, res ) {
});

router.get('/logout',function( req,res ){
	req.logout();
	res.redirect("/");
});

//--- End Authincation Routes
//

function isLoggedIn( req, res , next) {
	if( req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login")
}

module.exports = router;