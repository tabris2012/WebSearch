var express = require('express');
var router = express.Router();

/* GET filepath */
router.get('/', function(req, res, next) {
  const method = req.query.method;

  console.log("folder: "+method);
});


/* GET filepath with query. */
router.get('/search', function(req, res, next) {
  const key = req.query.key;
  const path = req.query.path;

  console.log(key);
});

module.exports = router;
