var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// view as static html
app.use(express.static(__dirname + '/views'));
//app.use(fallback('index.html', {root: __dirname + '/views'})); // react-routerでリロードできるように

// server side
var indexRouter = require('./routes');
var usersRouter = require('./routes/users');
app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = '3000';

app.listen(port, '0.0.0.0', () => {
  console.log("server starting");
})
