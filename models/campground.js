var mongoose = require('mongoose');

//define the schema
var campGroundSchema = new  mongoose.Schema({
  name:  String,
  cost:Number,
  location: String,
  lat:Number,
  lng:Number,
  description: String,
  date: { type: Date, default: Date.now },
  image: String,
  author:{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    username: String
  },
  comments:[
  	{
  		type: mongoose.Schema.Types.ObjectId,
  		ref:"Comment"
  	}
  ]
});

module.exports = mongoose.model("CampGround",campGroundSchema);