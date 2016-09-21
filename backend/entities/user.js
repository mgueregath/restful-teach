/**
 * @author Mirko Gueregat <mgueregath@emendare.cl>
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  first_name:  String,
  last_name: String,
  img: String,
  comment: String
});

var User = mongoose.model('user', userSchema);

module.exports = User;