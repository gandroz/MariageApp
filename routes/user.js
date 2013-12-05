/**
 * User controller
 */
var mongoose = require('mongoose')
  , passport = require('passport')
  , dbUser = require('../models/user')
  , User = dbUser.userModel;


exports.logout = function(req, res) {
	var name = req.user.username;
	req.logout();
	console.log('User ' + name + ' has logged out.');
	res.redirect('/');
};

/*
 * Facebook
 */
//http://stackoverflow.com/questions/19507941/facebook-authentication-with-passport-and-expressjs-why-is-verify-callback-not?rq=1
//http://stackoverflow.com/questions/11006318/using-passportjs-with-connect-for-nodejs-to-authenticate-facebook-users
exports.facebookLogin = passport.authenticate('facebook', { scope: [ 'email', 'user_location', 'user_birthday', 'user_photos' ] });
exports.facebookCallback = passport.authenticate('facebook', { successRedirect: '/home', failureRedirect: '/' });

/*
 * Google
 */
exports.googleLogin = passport.authenticate('google');
exports.googleReturn = passport.authenticate('google', { successRedirect: '/home', failureRedirect: '/' });

