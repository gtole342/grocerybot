const express = require('express');
const layouts = require('express-ejs-layouts');


const app = express();

app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.urlencoded({ extended: false}));
app.use(express.static(__dirname + '/static'))

app.get('/', (req,res)=>{
  res.render('home');
});

app.use('/users', require('./controllers/users'));
app.use('/recipes', require('./controllers/recipes'));
app.use('/mealplans', require('./controllers/mealplans'));

app.listen(process.env.PORT || 3000)