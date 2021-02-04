const { urlencoded } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

// View engine
app.set('view engine', 'ejs');

// Bodyparser middleware
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Connect flash
app.use(flash());

// Global vars
app.use((req, res) => {
  app.locals.success_msg = req.flash('success_msg');
})

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Database Connection
const keys = require('./config/keys');
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch((err) => console.log(err));

// Listen to port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App is running on port ${port}`));