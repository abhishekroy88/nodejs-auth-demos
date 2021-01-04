const router = require('express').Router();
const { Validator } = require('node-input-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');


// @route   GET /users/login
// @desc    Login page
router.get('/login', (req, res) => {
    res.render('login');
});


// @route   POST /users/login
// @desc    Login handler
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


// @route   GET /users/logout
// @desc    Logout handler
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('logoutSuccess', 'Successfully logged out.');
    res.redirect('/users/login');
});


// @route   GET /users/register
// @desc    Register page
router.get('/register', (req, res) => {
    res.render('register');
});


// @route   POST /users/register
// @desc    Register handler
router.post('/register', (req, res) => {
    const v = new Validator(req.body, {
        name: 'required',
        email: 'required|email',
        password: 'required|minLength:6',
        password2: 'required|same:password'
    });

    v.check()
    .then(matched => {
        if (matched) {
            // Validation went okay
            // Find the user and return it to the next 'then'

            return User.findOne({ email: req.body.email });
        } else {
            // Error: Validation was not successful
            // throw error to 'catch'

            throw Error();
        }
    })
    .then(user => {
        if (!user) {
            // User does not already exist
            // Hash the password and return it to the next 'then'
            
            return bcrypt.hash(req.body.password, 10);
        } else {
            // Error: User already exists
            // throw error to 'catch'

            throw Error();
        }
    })
    .then(hashed => {
        // Create an entry in the database
        // and return the user to the next 'then'

        return User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashed
        });
    })
    .then((user) => {
        // Save a success flash message
        // Redirect to the login page
        // TODO: appropriate success messages to the login page
        req.flash('registrationSuccess', 'You are now registered. Please login to enter.');
        res.redirect('/users/login');
    })
    .catch(err => {
        // If something fails
        // Redirect the user to the registration page
        // With appropriate error messages

        res.render('register', {
            registrationError: true,
            name: req.body.name,
            email: req.body.email
        });
    });
});


module.exports = router;