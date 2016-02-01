'use strict'

var mongoose = require('mongoose')
var Firebase = require('firebase')
var jwt = require('jwt-simple')
var moment= require('moment')

var JWT_SECRET = process.env.JWT_SECRET;

var ref = new Firebase('https://thisozanne.firebaseio.com')

var User;

var userSchema = mongoose.Schema({
  firebaseId: { type: String, required: true},
  email: { type: String, required: true}
});

userSchema.statics.register = function(userObj, cb){
  if(!userObj.email || !userObj.password){
    return cb('Missing Information You stupid MOTHER FUCKER!!')
  }
  ref.createUser(userObj, function(err, firebase){
    if(err) return cb(err);
    var user = new User();
    user.firebaseId = firebase.uid;
    user.email = userObj.email;
    user.save(cb);
  })
}

userSchema.statics.login = function(userObj, cb){
  if(!userObj.email || !userObj.password) {
    return cb('Missing required field (email, password)');
  }
  ref.authWithPassword(userObj, function(err, firebase){
    if (err) return cb(err);
    User.findOne({firebaseId: firebase.uid}, function(err, user){
      if(err = !user) return cb(err || "User does not exist please register")
      var token = user.generateToken()
      cb(null, token);
    })
  });
}

userSchema.methods.generateToken = function() {
  var payload ={
    firebaseId: this.firebaseId,
    _id: this._id,
    iat: moment().unix()
  }
  var token = jwt.encode(payload, JWT_SECRET)
  return token;
}

User = mongoose.model('User', userSchema);

module.exports = User;
