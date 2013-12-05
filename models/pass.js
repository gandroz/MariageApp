
var passport = require('passport')
  , mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , GoogleStrategy = require('passport-google').Strategy
  , dbUser = require('./user')
  , User = dbUser.userModel
  , config = require('../config.js');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
	User.findOne({ username: username }, function(err, user) {
       if (err) { return done(err); }
       if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
       user.comparePassword(password, function(err, isMatch) {
         if (err) return done(err);
         if(isMatch) {
           return done(null, user);
         } else {
           return done(null, false, { message: 'Invalid password' });
         }
       });
    });
}));

passport.use(new FacebookStrategy({
    clientID: config.Config.facebook.clientID,
    clientSecret: config.Config.facebook.clientSecret,
    callbackURL: config.Config.facebook.CallbackURL
},
  function (accessToken, refreshToken, profile, done) {
      User.findOne({ username: profile.displayName, email: profile.emails[0].value }, function (err, olduser) {
          if (err) { return done(err); }
          if (olduser) {
              return done(null, olduser);
          }
          else {
              if (profile.emails[0].value.indexOf('anne_cath') == 0 ||
                  profile.emails[0].value.indexOf('guillaume.and') == 0 ||
                  profile.emails[0].value.indexOf('badg') == 0) {
                  var birthday = new Date(profile._json.birthday);
                  var now = new Date;
                  var age = now.getFullYear() - birthday.getFullYear();
                  var ObjectId = mongoose.Types.ObjectId;
                  var newuser = new User({
                      username: profile.displayName,
                      email: profile.emails[0].value,
                      fbId: profile.id,
                      strategy: 'facebook'
                  });
                  newuser.save(function (err, newuser) {
                      if (err) {
                          console.log(err);
                      }
                      else {
                          console.log('New user: ' + newuser.username + " has register.");
                          done(null,newuser);
                      }
                  });
              }
              else {
                  console.log('Try to log with profile email: ' + profile.emails[0].value + ' This profile is not authorized');
                  redirect('/forbidden');
              }
          }
      });
  })
);

passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:8080/auth/google/return',
    realm: 'http://localhost:8080/'
  },
  function(identifier, profile, done) {
    User.findOrCreate({ openId: identifier }, function(err, user) {
      done(err, user);
    });
  }
));

// Simple route middleware to ensure user is authenticated.  Otherwise send to login page.
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
};