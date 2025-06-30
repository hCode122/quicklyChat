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


// Database connection
const dbURI = process.env.DB_URI;
app.use(cors({
  origin: '*' // Allow all origins
}));
main().catch((err) => console.log(err));

const PORT = process.env.PORT || 3002;

async function main() {
  (await mongoose.connect(dbURI, {dbName:'Cluster0'}).then(() => {
   console.log('server running...'); 
  }))
}

app.use((req, res, next) => {
  res.render = function(view, options) {
    console.warn(`res.render called with view "${view}" — blocked!`);
    console.trace('res.render was called');
    res.status(500).json({ error: `Tried to render view "${view}" — but this is an API-only server.` });
  };
  next();
});


app.use((req, res, next) => {
  console.log(`Incoming: ${req.method} ${req.originalUrl}`);
  next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.use('/api/auth/',authRouter);
app.use('/api/data/', indexRouter);



// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});


// Unified error handler
app.use((err, req, res, next) => {
  console.error('Final Error Handler:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    full: err
  });

  if (res.headersSent) return;

  res.status(err.status || 500).json({
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
});


// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});


app.locals.io = null; // Will be set by www file


module.exports = app;
