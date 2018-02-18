var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// add register route
router.get('/register', function(req, res){
  res.render('register');
});

// add login route
router.get('/login', function(req, res){
  res.render('login');
});

// add register route
router.post('/register', function(req, res){
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  //get some vlaidation
  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email is valid").isEmail();
  req.checkBody("username", "Username is required").notEmpty();
  req.checkBody("password", "password is required").notEmpty();
  req.checkBody("password2", "Passwords does not match").equals(req.body.password);


  //check for some error
  var errors = req.validationErrors();
  //check if there are any errors
  if (errors) {
    //if there are errors re-render the form
    res.render('register', {errors:errors});
  } else {
    //if there are no erros create new user with the user model
    var newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password
    });

    //create User
    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    //ser success message
    req.flash('success_msg', 'You are registed successful and now you can Log in');
    //redirect
    res.redirect('/users/login');
  }
});

// gets the username --> finds if there is a username that matches
// Then it validates the password
  passport.use(new LocalStrategy(
    function(username, password, done) {
     User.getUserByUsername(username, function(err, user){
     	if(err) throw err;
     	if(!user){
     		return done(null, false, {message: 'Unknown User'});
     	}

     	User.comparePassword(password, user.password, function(err, isMatch){
     		if(err) throw err;
     		if(isMatch){
     			return done(null, user);
     		} else {
     			return done(null, false, {message: 'Invalid password'});
     		}
     	});
     });
    }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

// making a post request
router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

  // route for the logout button
  router.get('/logout', function(req, res){
    req.logout();

    req.flash('success_msg', 'You are logged out');

    // redirect to the login page
    res.redirect('/users/login');
  })

module.exports = router;
