const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req, res) => {
    // console.log(req.sessionID);
    if (!req.isAuthenticated()) {
        res.render('login', { layout: 'layouts/loginLayout' });
    } else {
        res.redirect('/dashboard');
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/auth/login');
});

router.post('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/auth/login' }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);

module.exports = router;