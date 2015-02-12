var express = require('express');
var router = express.Router();
var system = require("sys");
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Madhacks' });
});


module.exports = router;

