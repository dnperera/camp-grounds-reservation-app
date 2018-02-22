var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect or create  mongo db 'camp_grounds'
mongoose.connect('mongodb://localhost/camp_grounds');

//define the schema
var campGroundSchema = new  mongoose.Schema({
  name:  String,
  location: String,
  description: String,
  date: { type: Date, default: Date.now },
  image: String
});

//create the model
var CampGround = mongoose.model("CampGround",campGroundSchema);

// //add new record
// CampGround.create({
// 		name: 'Carpinteria State Beach Campground',
// 		location: 'California',
// 		description: 'Carpinteria State Beach is a beautiful mile-long beach located just 12 miles from Santa Barbara.  It’s a very popular campground with 216 campsites for RVs, tents and trailers. The maximum size for trailers and RVs is 35 feet. Carpinteria campground is actually divided into 4 sections, named after the Channel Islands: Anacapa, Santa Cruz, Santa Rosa and San Miguel. Anacapa and Santa Cruz is the only area for tents, and if you want to be fronting the beach, request Santa Cruz. If you have an RV and want to be fronting the beach, request Santa Rosa or San Miguel. Carpinteria State Beach campground has flush toilets, hot showers, a visitor center and dump station. Each campsite has a table, fire ring and grill.',
// 		image :'https://www.campsitephotos.com/photo/camp/7178/Carpinteria_State_Beach_Creek.jpg'
// 	},function( error ,data ){
// 		if(error) {
// 			console.log('New record was not saved ....');
// 			console.log(error);
// 		}else {
// 			console.log('new camp ground added ...');
// 			console.log(data);
// 		}
// });

//get the access to the static camp ground data
//var campGrounds = require('./data/camp-grounds')

var port = process.env.PORT || 3000;
var ip = process.env.IP || '127.0.0.1';

app.use(bodyParser.urlencoded({extended:true}));

//set the path for the static assets
app.use(express.static("public"));

//set the view Engine
app.set("view engine","ejs");

app.get('/',function(req,res) {
	res.render("landing")
});

//Index route - display all camp grounds
app.get('/camp-grounds',function(req,res){
	//Get all camp grounds from DB
	CampGround.find({} ,function( error, data){
		if(error) {
			res.render("camp-grounds",{campGrounds:[]});
			console.log(error);
		}
		res.render("index",{campGrounds:data})
	});
});

//Create new campground
app.post('/camp-grounds',function(req,res){
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
app.get('/camp-grounds/new',function(req,res) {
	res.render('add-camp')
});

//Display details of the selected campground
app.get('/camp-grounds/:id',function( req,res) {
	//get selected campground details
	CampGround.findById(req.params.id, function ( error ,data) {
		if( error) {
			console.log(error);
		}else {
			res.render('show',{campground:data});
		}
	});
});

app.listen(port,ip,() => {
	console.log(`Server started listening on port ${port}`);
});