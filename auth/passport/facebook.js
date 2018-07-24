'use strict';

const uuidv4 = require('uuid/v4');

const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = require('../../config');

const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../../model/User');

const fbStrategy = new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:8080/auth/facebook/return',
  profileFields: ['id']
},
(accessToken, refreshToken, profile, cb) => {
  User.findOne({facebookId: profile.id}, (err, user) => {
    if (err) {
      return cb(err);
    }
    if (user) {
      return cb(null, false);
    }
    else {
      let newUser = new User();
      newUser.username = uuidv4();
      newUser.password = uuidv4();
      newUser.facebookId = profile.id;

      newUser.save((err) => {
        if (err) {
          throw err;
        }
        return cb(null, newUser);
      });
    }
  });
}
);

module.exports = fbStrategy;