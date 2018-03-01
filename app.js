var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var sessions = require('express-session');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var User = require('./models/user');

//requiring routes
var authRoutes = require('./routes/authentication');
var commentRoutes = require('./routes/comments');
var campgroundRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');

//connect or create  mongo db 'camp_grounds'
//mongoose.connect('mongodb://localhost/camp_grounds');
mongoose.connect('mongodb://dnperera:dphp94903@ds153198.mlab.com:53198/camp_grounds');
//mongodb://dnperera:dphp94903@ds153198.mlab.com:53198/camp_grounds
var port = process.env.PORT || 3000;
var ip = process.env.IP || '127.0.0.1';

app.use(bodyParser.urlencoded({extended:true}));

app.use(methodOverride('_method'));

//set the path for the static assets
app.use(express.static(__dirname+"/public"));

//set the view Engine
app.set("view engine","ejs");

//set flash middle ware 
app.use(flash());

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
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

//set express to use Router routes
app.use(indexRoutes);
app.use(authRoutes);
app.use("/camp-grounds/:id/comments",commentRoutes);
app.use("/camp-grounds",campgroundRoutes);

app.listen(process.env.PORT,process.env.PORT,() => {
	console.log(`Server started listening on port ${port}`);
});

