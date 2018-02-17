var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

//set the path for the static assets
app.use(express.static("public"));

//set the view Engine
app.set("view engine","ejs");

app.get('/',function(req,res) {
	res.render('animal',{name :'Emet'});
});

app.get('/camps/hello/:number',function(req,res) {
	var times = req.params.number;
	var helloStr ='';
	for( var i=0; times > i;i++){
		helloStr += 'hello '
	}
	res.send(`<h1> no of hello - ${helloStr} </h1>`)
});


app.listen(port,process.env.IP,() => {
	console.log(`Server started listening on port ${port}`);
});