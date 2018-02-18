// require different packages
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

// connect to mongoose
mongoose.connect('mongodb://localhost/loginapp', { useMongoClient: true });
var db = mongoose.connection;

// making the routes for the web page
var routes = require('./routes/index');
var users = require('./routes/users');

// initialize app
var app = express();

// view engine
// set folder to handle the views
// tell express which engine to use
app.set('views', path.join(__dirname, 'views'));
// Tell Express that for files with extension html you would like to call the exphbs function to render them
app.engine('handlebars', exphbs({defaultLayout : 'layout'}));
app.set('view engine', 'handlebars');

//Body pareser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

// set static folder to hold style sheets, images, jquery
// stuff that is public to the browser
app.use(express.static(path.join(__dirname, 'public')));

// middleware for Express session
app.use(session({
	secret: "secret",
	saveUninitialized: true,
	resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// middleware for the Express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// connect to the flash middleware
app.use(flash());

// create global variables for flash messages
// Glob. Messages
// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// initialisation of the passport
app.use(passport.initialize());
app.use(passport.session());

// some middleware for the routes
app.use('/', routes);
app.use('/users', users);

// set the port and start the server

// set the port
app.set('port', (process.env.PORT || 3000));

// listen to port
app.listen(app.get('port'), function(){
	console.log('Server started at port' + app.get('port'));
});
