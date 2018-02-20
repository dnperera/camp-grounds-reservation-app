var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//get the access to the static camp ground data
var campGrounds = require('./data/camp-grounds')

var port = process.env.PORT || 3000;
var ip = process.env.IP || '127.0.0.1';

app.use(bodyParser.urlencoded({extended:true}));

//set the path for the static assets
app.use(express.static("public"));

//set the view Engine
app.set("view engine","ejs");

app.get('/',function(req,res) {
	res.render("index")
});

app.get('/camp-grounds',function(req,res){
	res.render("camp-grounds",{campGrounds:campGrounds})
})

app.post('/camp-grounds',function(req,res){
	console.log(req.body);
	res.render("camp-grounds",{campGrounds:campGrounds})
});

app.get('/camp-grounds/add-camp',function(req,res) {

	res.render('add-camp')
});

app.listen(port,ip,() => {
	console.log(`Server started listening on port ${port}`);
});