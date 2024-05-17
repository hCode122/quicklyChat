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
async function main() {
  (await mongoose.connect(dbURI, {dbName:'Cluster0'}).then(() => {
    app.listen(3002, () => console.log('server running...')); 
  }))
}

var io = require("socket.io")("https://quicklychat.onrender.com",{
  cors: {
    origin: '*',
  }
})
const globalUsers = new Map();
// socket connection
io.on("connection", (socket) => {

    socket.on("register", (name, id) => {
      socket.user = name
      if (globalUsers.has(id)) {
        console.log("User already exist")
      } else {
        globalUsers.set(name, id)
        console.log(globalUsers)
      }
    })

    socket.on("send-message", (message, target) => {
      console.log("received a message, sending....")
      const room = globalUsers.get(target)
      socket.to(room).emit("receive-message", message)
    })

    socket.on("disconnect",() => {
      console.log(socket.user)
      globalUsers.delete(socket.user)
      const date = new Date()
      updateLastOnline(socket.user, date)
    })
  })

const updateLastOnline = async (name,date) => {
  try {
    await User.updateOne({name:name}, {
      lastOnline: 
        date
      
    })
    console.log(await User.findOne({name}))
  } catch (e) {
    console.log(e)
  }
  
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

module.exports = app;
