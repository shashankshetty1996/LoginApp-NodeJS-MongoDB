const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// model
const User = mongoose.model('user');

module.exports = (passport) => {
  passport.use(new LocalStrategy({usernameField: 'username'}, (username, password, done) => {
    // Match username
    User.findOne({username: username})
      .then(user => {
        if(!user) {
          return done(null, false, {message: 'No user found'});
        } 

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err) throw err;
          if(isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {message: 'password incorrect'});            
          }
        });
      });
  }));

  // Serialize user function
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user function
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}