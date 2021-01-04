const router = require('express').Router();
const passport = require('passport');

router.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('dashboard', {
            name: req.user.firstName
        });
    }
    else res.redirect('/auth/login');
});

module.exports = router;