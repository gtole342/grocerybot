require('dotenv').config();
const express = require('express');
const flash = require('connect-flash');
const moment = require('moment')
const layouts = require('express-ejs-layouts');
const passport = require('./config/passportConfig');
const session = require('express-session');


const app = express();

app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.urlencoded({ extended: false}));
app.use(express.static(__dirname + '/static'));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  res.locals.moment = moment;
  next();
});

app.use('/user', require('./controllers/user'));
app.use('/recipes', require('./controllers/recipes'));
app.use('/mealplans', require('./controllers/mealplans'));


app.get('/', (req,res)=>{
  res.render('home');
});

app.get('*', (req, res)=>{
  res.render('404');
});

app.listen(process.env.PORT || 3000);