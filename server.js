const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');

// Creating express app
const app = express();

// Route files
const index = require('./route/index');

// config
// keys
const keys = require('./config/keys');
// passport config
require('./config/passport')(passport);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setting up static folder
app.use('/', express.static(path.join(__dirname, 'public')));

// Mapping global promise with mongoose
mongoose.Promise = global.Promise;

// Connecting MongoDB
mongoose.connect(keys.mongoURI)
.then(() => console.log('MongoDB Connected Successfully'))
.catch((err) => console.log(err));

// Load the models
require('./model/User');
const User = mongoose.model('user');

// View Engine
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: 'hbs'
}));
app.set('view engine', 'hbs');

// express session middleware
app.use(session({
  secret: keys.secretOrKey,
  resave: true,
  saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash initializer
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// route
app.use('/', index);

// Define port
let port = process.env.PORT || 5000;

// Express server
app.listen(port, () => console.log(`Server started on port ${port}`));