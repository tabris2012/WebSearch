var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const static = require('node-static');

var app = express();
var app2 = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// view as static html
app.use(express.static(__dirname + '/views'));
//app.use(fallback('index.html', {root: __dirname + '/views'})); // react-routerでリロードできるように

// setup static server
const data_dir = '/data/crawling';
const fileServer = new static.Server(data_dir); //charset=Shift-JISが有効なサーバ
app.use('/fs',function(req, res, next) { //引数4個はエラー処理になってしまう
  fileServer.serve(req,res);
});

// server side
var fileRouter = require('./routes/file');
var folderRouter = require('./routes/folder');
var noteRouter = require('./routes/note');
app.use('/api/file', fileRouter);
app.use('/api/folder', folderRouter);
app.use('/api/note', noteRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = '80';

app.listen(port, '0.0.0.0', () => {
  console.log("App server starting");
});
/*
var port2 = '3001';
require('http').createServer(function(req,res) {
  req.addListener('end', function() {
    fileServer.serve(req,res);
  }).resume();
}).listen(port2,'0.0.0.0', () => {
  console.log("File server starting");
});
*/