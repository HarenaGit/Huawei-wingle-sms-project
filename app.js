var express = require('express');
var path = require('path');
var logger = require('morgan');
var index = require('./routes/index');
var app = express();
var bodyParser = require('body-parser')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set path for static assets
app.use(express.static(path.join(__dirname, 'public')));

//body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


// routes
app.use('/',bodyParser.json(), index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error', {status:err.status, message:err.message});
});

//base url
app.locals.baseURL = "http://localhost:3000"


module.exports = app;
