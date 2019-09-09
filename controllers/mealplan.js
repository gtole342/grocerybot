const router = require('express').Router();
const mealplan = require('../models').mealplan;
const recipe = require('../models').recipe;
const ingredient = require('../models').ingredient;
const mealplansRecipes = require('../models').mealplansRecipes;
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
    where: {weekdate: req.params.weekdate},
    include: [
      {
        model: recipe,
        include: [ingredient]
      }
    ]
  })
  .then((mealplan)=>{
    mealplan.recipes.forEach(recipe=>{
      console.log(recipe);
      recipe.ingredients.forEach(ingredient=>{
        console.log(ingredient)
      })
    })
   res.render('mealplan/showOne', { mealplan: mealplan});
  });
};

const getNewMealplanPage = (req,res) => {
  res.render('mealplan/new');
};

const postNewMealplan = (req,res) => {
  let weekdate = `${moment().format('L')}-${moment().add(7,'days').calendar()}`;
  console.log(weekdate)
 while(weekdate.includes('/')){
   weekdate = weekdate.replace('/','.');
 }
  console.log(weekdate);
  mealplan.create({
    weekdate: weekdate,
    userId: req.user.id
  })
  .then( async (createdMealplan)=>{
    let exclude = []
    for(let i = 0; i < 7; i++){
      let index = await getRandomRecipeIndex(exclude)
      exclude.push(index)
      await recipe.findByPk(index)
      .then((foundRecipe)=>{
        console.log(foundRecipe)
        createdMealplan.addRecipe(foundRecipe);
      });
    }
    res.redirect(`/mealplan/${createdMealplan.weekdate}`);
  });
};

const editMealPlan = (req,res) => {
  mealplan.findOne({
    where: {
      weekdate: req.params.weekdate
    },
    include: [recipe]
  })
  .then((mealplan)=>{
    mealplansRecipes.destroy({
      where: {
        mealplanId: mealplan.id,
        recipeId: req.body.recipe
      }
    })
    .then(()=>{
      mealplan.addRecipe(getRandomRecipeIndex([]))
      res.redirect(`/mealplan/${mealplan.weekdate}`);  
    })
  });
};

const deleteMealPlan = (req,res) =>{
  mealplan.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(()=>{
    res.redirect('/mealplan')
  })
};

const getRandomRecipeIndex = async (exclude) =>{
  let recipes = await recipe.findAll()
  let numOfRecipes = recipes.length
  let number = Math.floor(Math.random() * numOfRecipes)
  while(exclude.includes(number)){
    number = Math.floor(Math.random() * numOfRecipes)
  }
  return number

};

router.get('/', getAllMealplans);
router.get('/new', getNewMealplanPage);
router.get('/:weekdate', getOneMealplan);
router.post('/new',postNewMealplan);
router.put('/:weekdate/edit', editMealPlan);
router.delete('/:id/delete', deleteMealPlan);

module.exports = router;
