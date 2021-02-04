const { Router } = require('express');
const validator = require('email-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const router = Router();

// Login page
router.get('/login', (req, res) => res.render('login'));

// Register page
router.get('/register', (req, res) => res.render('register'));

// Post register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = [];

  // Check if email is valid
  if (!validator.validate(email)) {
    errors.push({ msg: 'Email is not valid'});
  }
  
  // Check if all fields are filled in
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'All fields are required'});
  }

  // Check if password is matches
  if (password !== password2) {
    errors.push({ msg: 'Password does not match'});
  }

  // Check if password length is 6 chars
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters'});
  }

  // Check if any error
  if (errors.length > 0) {
    res.render('register', {
      name,
      email,
      password,
      password2,
      errors
    });
  } else {
    // Check if email is already registered
    User.findOne({ email })
      .then((user) => {
        if (user) { // if yes
          errors.push({ msg: 'This email is already registered'});
          res.render('register', {
            name,
            email,
            password,
            password2,
            errors
          });
        } else { 
          // save user to DB
          // hash password
          const saltRounds = 10;
          bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              User.create({
                name,
                email,
                password: hash,
              })
                .then(() => {
                  // Set flash
                  req.flash('success_msg', 'You are successfully registered and can log in');
                  res.redirect('/users/login');
                });
            })
          })
        }
      })


  }
});

module.exports = router;