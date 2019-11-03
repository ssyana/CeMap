var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Expres' });
  //  res.sendFile("../public/" + "map.html" );
});

module.exports = router;

