var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var sessions = require('express-session');
var User = require('./models/user');

//requiring routes
var authRoutes = require('./routes/authentication');
var commentRoutes = require('./routes/comments');
var campgroundRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');

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
});

//set express to use Router routes
app.use(indexRoutes);
app.use(authRoutes);
app.use("/camp-grounds/:id/comments",commentRoutes);
app.use("/camp-grounds",campgroundRoutes);

app.listen(port,ip,() => {
	console.log(`Server started listening on port ${port}`);
});

