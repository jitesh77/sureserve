var mongoose = require('mongoose');
// require bcrypt to encrypt the password with hashes
var bcrypt = require('bcryptjs');

//connect mongoose with the mongo db database
mongoose.connect('mongodb://username:password@ds235788.mlab.com:35788/jiteshg77');
var db = mongoose.connection;db.on('error', console.error.bind(console, 'MongoDB connection error: '));
// create a shema for the sample user
var UserSchema = mongoose.Schema({
  username:{
    type: String,
    index: true
  },
  password:{
    type: String
  },
  email:{
    type: String
  },
  Name:{
    type: String
  }
});

//create a variable that can be accessible outside of the file
var User = module.exports = mongoose.model('User', UserSchema);

//create user
module.exports.createUser  = function(newUser, callback){
  //user bcrypt to hash Passwords
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        // Store hash in your password DB.
        newUser.password = hash;
        newUser.save(callback);
    });
  });
}

// export getUserByUsername function to authenticate
module.exports.getUserByUsername = function(username, callback){
  var query = {username: username};
  User.findOne(query, callback);
}

// export getUserByID function to find user by ID
module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

// export function to compare the password
module.exports.comparePassword = function(candidatePassword, hash, callback){
  // Load hash from your password DB.
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if(err) throw err;
    callback(null, isMatch);
});
}
