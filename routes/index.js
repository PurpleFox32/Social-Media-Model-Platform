var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;