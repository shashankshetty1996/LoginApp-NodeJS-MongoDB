const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

let router = express.Router();

// User model
require('../model/User');
const User = mongoose.model('user');

// Load helper 
const { ensureAuthenticated } = require('../helpers/auth');

// index page route
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('index');
});

// Login page route
router.get('/login', (req, res) => {
  res.render('login');
});

// Login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
  if(req.isAuthenticated()) {
    req.flash('success_msg', 'Logged in successfully'); 
  }   
});

// logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// Register page route
router.get('/register', (req, res) => {
  res.render('register');
});

// Register user
router.post('/register', (req, res) => {
  let errors = [];
  
  if(req.body.password !== req.body.cpassword) {
    errors.push({text: `password is not matching`});
  }

  if(req.body.password.length < 4) {
    errors.push({text: `Password should be minimum of four character`});
  }

  if(req.body.phone.length !== 10) {
    errors.push({text : `Invalid phone number length`});
  }

  if(errors.length > 0) {
    res.render('register', {
      errors: errors,
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      cpassword: req.body.cpassword,
      phone: req.body.phone,
      email: req.body.email
    });
  } else {
    // Checking if the username is already taken
    User.findOne({username: req.body.username})
      .then(user => {
        if(user) {
          errors.push({text: `username already taken`});
          res.render('register', {
            errors: errors,
            name: req.body.name,
            password: req.body.password,
            cpassword: req.body.cpassword,
            phone: req.body.phone,
            email: req.body.email
          });         
        } else {
          // Creating User object
          const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            phone: req.body.phone,
            email: req.body.email,
          });
      
          // Hashing password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              // Replacing password with hashed password
              newUser.password = hash;
              // Adding new entry to the database
              newUser.save().then(user => {
                // successful
                req.flash('success_msg', 'Registration successful');
                res.redirect('/login');
              }).catch(err => console.log(`error ${err}`));
            });
          });
        }
      });
  }
});

module.exports = router;