var express = require('express');
var router = express.Router();

var User = require('../models/user.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req,res){
  User.register(req.body, function(err, savedUser){
    res.status(err ? 400 : 200).send(err || savedUser);
  })
})

router.post('/login', function(req,res){
  User.login(req.body, function(err, token){
    if (err) return res.status(400).send(err)
    res.cookie('userToken', token).send(token)
  })
})

module.exports = router;
