var express = require('express');
var router = express.Router();
var fs = require('fs');
const iconv = require('iconv-lite');

const root_path = './data/crawling/';
/* GET file contents. */
router.get('/', function(req, res, next) {
  const path = req.query.path;

  const text = iconv.decode(fs.readFileSync(root_path+path),'shift-jis');
  res.status(200).send(text);
});

module.exports = router;
