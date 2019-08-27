const router = require('express').Router();
const db = require('../models');

router.get('/', (req,res)=>{
  db.mealplans.findAll()
  .then((mealplans)=>{
    res.render('mealplans/showAll', { mealplans: mealplans });    
  });
});

router.get('/new', (req,res)=>{
  res.render('mealplans/new');
});

router.get('/:weekdate', (req,res)=>{
  db.mealplans.findOne({ where: {name: req.params.weekdate}})
  .then((mealplan)=>{
   res.render('mealplans/showOne', { mealplan: mealplan});
  });
});

module.exports = router;
