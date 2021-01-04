const router = require('express').Router();

// @route   GET /
// @desc    Home page
router.get('/', (req, res) => {
    res.render('home');
});


// @route   GET /
// @desc    Home page
router.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('dashboard', {
            name: req.user.name
        });
    } else {
        req.flash('unauthorizedError', 'Please login to view this resource.');
        res.redirect('/users/login');
    }
});


module.exports = router;