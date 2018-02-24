var mongoose = require('mongoose');

//define the schema
var campGroundSchema = new  mongoose.Schema({
  name:  String,
  location: String,
  description: String,
  date: { type: Date, default: Date.now },
  image: String,
  comments:[
  	{
  		type: mongoose.Schema.Types.ObjectId,
  		ref:"Comment"
  	}
  ]
});

module.exports = mongoose.model("CampGround",campGroundSchema);