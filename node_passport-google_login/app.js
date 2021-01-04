const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');

// Dotenv config
require('dotenv').config();

// Passport config
require('./config/passport')(passport);


// Our Express app
const app = express();

// Connect to DB
require('./config/db')();


// Middleware
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/mainLayout');
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/index'));


// Server start
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}..`);
});
