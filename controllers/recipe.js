const router = require('express').Router();
const recipe = require('../models').recipe;
const ingredient = require('../models').ingredient;

const getAllRecipesPage = (req,res) => {
  recipe.findAll({ include: [ingredient] })
  .then((recipes)=>{
    res.render('recipes/show', { recipes: recipes });
  });
};

const getNewRecipePage = (req,res) => {
  res.render('recipes/new');
};

const postNewRecipe = (req,res) => {
  recipe.create({
    name: req.body.name,
    cookTime: req.body.cookTime,
    prepTime: req.body.prepTime,
    instructions: req.body.instructions
  })
  .then((recipe)=>{
    req.body.ingredients.forEach( async (ingredient)=>{
      await recipe.createIngredient({
        name: ingredient.name,
        amount: ingredient.amount,
      });
    });
    return recipe.id;
  })
  .then((id)=>{
   res.redirect(`/recipes/${id}`);
  });
};

const getRecipePage = (req,res) => {
  recipe.find({
    where: { id: req.params.id},
    include: [ingredient]
  })
  .then((recipe)=>{
    res.render('recipes/show', { recipe: recipe });
  });
};

const deleteRecipe = (req,res) => {
  recipe.destroy({
    where: { id: req.params.id },
    include: [ingredient]
  })
  .then(()=>{
    res.send('/recipes');
  });
};

const getEditRecipePage = (req,res) => {
  recipe.find({
    where: {id: req.params.id},
    include: [ingredient]
  })
  .then((recipe)=>{
    res.render('recipe/edit', { recipe: recipe});
  });
};

const editRecipe = (req,res) => {
  recipe.update({
    where: {id: req.params.id},
    fields: {
      name: req.body.name,
      cookTime: req.body.cookTime,
      prepTime: req.body.prepTime,
      instructions: req.body.instructions
    }
  })
  .then((recipe)=>{
    recipe.getIngredients()
    .then((ingredients)=>{
      ingredients.forEach( async (each)=>{
        await ingredient.update({
          where: {
            name: each.name,
            amount: each.amount
          },
          fields: {
            name: each.name,
            amount: each.amount
          }
        });
      });
    });
  });
};

router.get('/', getAllRecipesPage);
router.get('/new', getNewRecipePage);
router.post('/new', postNewRecipe);
router.get('/:id', getRecipePage);
router.delete('/:id/delete', deleteRecipe);
router.get('/:id/edit', getEditRecipePage);
router.put('/:id/edit', editRecipe);


module.exports = router;