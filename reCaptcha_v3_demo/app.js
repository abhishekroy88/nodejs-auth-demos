// Imports
const express = require('express');
const request = require('request');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

// Our Express app
const app = express();

// dotenv config
require('dotenv').config();

// Middleware
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());                                    
app.use(express.static('public'));
app.use(session({                                                                                                    
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));                                                                                                    


// Routes
// Login page
app.get('/', (req, res) => {
    res.render('login');
});

// Home page
app.get('/home', (req, res) => {
    if (req.session.isLoggedIn) res.render('home');
    else res.redirect('/');
});

// Logout handler
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Login handler
app.post('/verify', (req, res) => {
    if (!req.body.captcha) {
        return res.json({ success: false });
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body.captcha}`;

    request(verifyUrl, (err, response, body) => {
        const resBody = JSON.parse(body);
        
        if (!resBody.success || resBody.score < 0.5) {
            return res.json({ success: false });
        }

        req.session.isLoggedIn = true;
        return res.json({ success: true });
    });
});


// Server start
app.listen(3000, () => {
    console.log('Server running on port 3000..');
});
