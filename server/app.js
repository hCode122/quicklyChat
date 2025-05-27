var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var env = require('dotenv').config();
var mongoose = require('mongoose')
var User = require("./models/User") 
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var cors = require("cors")
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Database connection
const dbURI = process.env.DB_URI;
app.use(cors())
main().catch((err) => console.log(err));

const PORT = process.env.PORT || 3002;

async function main() {
  (await mongoose.connect(dbURI, {dbName:'Cluster0'}).then(() => {
   console.log('server running...'); 
  }))
}




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth/',authRouter);
app.use('/api/data/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.locals.io = null; // Will be set by www file

// Modify your error handler to not use views if you're not using them:
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

module.exports = app;
