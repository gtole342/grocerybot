const router = require('express').Router();
const mealplan = require('../models').mealplan;
const recipe = require('../models').recipe;
const moment = require('moment');

router.get('/', (req,res)=>{
  mealplan.findAll()
  .then((mealplans)=>{
    res.render('mealplans/showAll', { mealplans: mealplans });    
  });
});
router.get('/:weekdate', (req,res)=>{
  mealplan.findOne({ where: {name: req.params.weekdate}})
  .then((mealplan)=>{
   res.render('mealplans/showOne', { mealplan: mealplan});
  });
});

router.get('/new', (req,res)=>{
  res.render('mealplans/new');
});
router.post('/new',(req,res)=>{

  let weekdate = `${moment().calendar}-${moment().add(req.body.days,'days').calendar()}`;
  mealplan.findOrCreate({
      where: { weekdate: weekdate}
  })
  .spread((mealplan, created)=>{
    generateRecipes(req.body.days)
    .forEach((recipe)=>{
      console.log(recipe);
    });
  });
});

const generateRecipes = async (numOfMeal) => {
  let recipes = []
  for(let i = 0; i < numOfMeal; i++){
     await recipe.findByPk(i).then((recipe)=>{
      recipes.push(recipe);
    });
  }
  return recipes;
};

module.exports = router;
