const LocalStrategy = require('passport-local').Strategy;
// const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({email: email})
        .then((user) => {
            if (user) {
                bcrypt.compare(password, user.password)
                .then(same => {
                    if (same) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password is incorrect.' })
                    }
                })
                .catch(err => { throw err; });
            } else {
                return done(null, false, { message: 'Email is not registered.' });
            }
        })
        .catch(err => console.log(err));
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};