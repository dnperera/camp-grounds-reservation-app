var express = require('express');
var app = express();
//get the access to the static camp ground data
var campGrounds = require('./data/camp-grounds')

var port = process.env.PORT || 3000;
var ip = process.env.IP || '127.0.0.1';

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

app.listen(port,ip,() => {
	console.log(`Server started listening on port ${port}`);
});