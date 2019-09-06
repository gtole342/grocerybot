const router = require('express').Router();
const mealplan = require('../models').mealplan;
const recipe = require('../models').recipe;
const ingredient = require('../models').ingredient;
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
    for(let i = 0; i < 7; i++){
      await recipe.findByPk(i)
      .then((foundRecipe)=>{
        createdMealplan.addRecipe(foundRecipe);
      });
    }
    res.redirect(`/mealplan/${createdMealplan.weekdate}`);
  });
};

// const getEditMealPlanPage = (req,res) =>{
//   mealplan.find({
//     where: {
//       weekdate: req.params.weekdate
//     },
//     include: [recipe]
//   })
//   .then((mealplan)=>{
//     res.render('mealplan/edit', {mealplan: mealplan});
//   });
// };

// const editMealPlan = (req,res) => {
//   mealplan.find({
//     where: {
//       weekdate: req.params.weekdate
//     },
//     include: [recipe]
//   })
//   .then((mealplan)=>{
//     let recipe = mealplan.recipes[req.params.recipe];
//     res.send(recipe);    
//   });
// };

// const deleteMealPlan = (req,res) =>{
//   mealplan.destroy({
//     where: {
//       weekdate: req.params.weekdate
//     }
//   })
//   .then(()=>{
//     res.redirect('/user')
//   })
// };

router.get('/', getAllMealplans);
router.get('/new', getNewMealplanPage);
// router.get('/:weekdate/edit', getEditMealPlanPage);
router.get('/:weekdate', getOneMealplan);
router.post('/new',postNewMealplan);
// router.put('/:weekdate/edit', editMealPlan);
// router.delete('/:weekdate/delete', deleteMealPlan);

module.exports = router;
