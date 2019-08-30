const router = require('express').Router();
const mealplan = require('../models').mealplan;
const recipe = require('../models').recipe;
const moment = require('moment');

const getAllMealplans = (req,res) => {
  mealplan.findAll({ 
    include : [recipe]
  })
  .then((mealplans)=>{
    res.render('mealplan/showAll', { mealplans: mealplans });    
  });
};

const getOneMealplan = (req,res) => {
  mealplan.findOne({ 
    where: {name: req.params.weekdate},
    include: [recipe]
  })
  .then((mealplan)=>{
   res.render('mealplan/showOne', { mealplan: mealplan});
  });
};

const getNewMealplanPage = (req,res) => {
  res.render('mealplan/new');
};

const postNewMealplan = (req,res) => {
  let weekdate = `${moment().calendar}-${moment().add(req.body.days,'days').calendar()}`;
  mealplan.create({
    where: { weekdate: weekdate},
  })
  .then( async (mealplan)=>{
    await generateRecipes(req.body.days)
    .forEach(async (recipe)=>{
     await mealplan.addRecipe(recipe);
    });
    res.redirect(`/mealplan/${mealplan.weekdate}`);
  });
};

const getEditMealPlanPage = (req,res) =>{
  mealplan.find({
    where: {
      weekdate: req.params.weekdate
    },
    include: [recipe]
  })
  .then((mealplan)=>{
    res.render('mealplan/edit', {mealplan: mealplan});
  });
};

const editMealPlan = (req,res) => {
  mealplan.find({
    where: {
      weekdate: req.params.weekdate
    },
    include: [recipe]
  })
  .then((mealplan)=>{
    let recipe = mealplan.recipes[req.params.recipe];
    res.send(recipe);    
  });
};

const deleteMealPlan = (req,res) =>{
  res.send('Gotta add that delete function');
};

const generateRecipes = async (numOfMeal) => {
  let recipes = [];
  for(let i = 0; i < numOfMeal; i++){
     await recipe.findByPk(i).then((recipe)=>{
      recipes.push(recipe);
    });
  }
  return recipes;
};


router.get('/', getAllMealplans);
router.get('/new', getNewMealplanPage);
router.get('/:weekdate/edit', getEditMealPlanPage);
router.get('/:weekdate', getOneMealplan);
router.post('/new',postNewMealplan);
router.put('/:weekdate/edit', editMealPlan);
router.delete('/:weekdate/delete', deleteMealPlan);

module.exports = router;
