var express = require('express');
var router = express.Router();
var fs = require('fs');

const root_path = './data/crawling/';
/* GET file contents. */
router.get('/', function(req, res, next) {
  const path = req.query.path;

  fs.readFile(root_path+path, 'SHIFT-JIS', function(err,text) {
    console.log(text);
    res.status(200).send(text);
  });
});

module.exports = router;
