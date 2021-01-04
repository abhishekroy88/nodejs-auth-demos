const express = require('express');
const session = require('express-session');
const request = require('request');
const expressLayouts = require('express-ejs-layouts');


// dotenv config
require('dotenv').config();


// Our Express app
const app = express();


// Middleware
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));


// Routes
app.get('/', (req, res) => {
    if (!req.session.isLoggedIn) res.render('login', { loginPage: true });
    else res.render('home');
});

app.post('/verify', (req, res) => {
    if (!req.body.captcha) {
        return res.json({ success: false });
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

    request(verifyUrl, (err, response, body) => {
        const resBody = JSON.parse(body);

        // If error
        if (err) return res.json({ success: false });
        
        //If unsuccessful
        if (!resBody.success) return res.json({ success: false });

        // If successful
        req.session.isLoggedIn = true;
        return res.json({ success: true });
    });
});

app.get('/home', (req, res) => {
    if (req.session.isLoggedIn) res.render('home');
    else res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


// Server
app.listen(3000, () => {
    console.log('Server running on port 3000...');
})