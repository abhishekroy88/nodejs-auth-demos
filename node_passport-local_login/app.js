// Imports
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


// The Express app
const app = express();


// Passport config
require('./config/passport')(passport);


// Database connection
const db = require('./config/keys').MONGO_URI;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(() => console.log('MongoDB connected..'))
.catch(err => console.log(err));


// Middleware
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: require('./config/keys').SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// Global variables
app.use((req, res, next) => {
    res.locals.registrationSuccess = req.flash('registrationSuccess');
    res.locals.loginError = req.flash('error'); // Passport failureFlash uses 'error'
    res.locals.logoutSuccess = req.flash('logoutSuccess');
    res.locals.unauthorizedError = req.flash('unauthorizedError');
    next();
});


// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


// Server start
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
