var mongoose = require('mongoose');

//define the schema
var commentSchema = new  mongoose.Schema({
  text:  String,
  author: String
});

module.exports = mongoose.model("Comment",commentSchema);