const router = require('express').Router();
const recipe = require('../models').recipe;
const ingredient = require('../models').ingredient;

const getUserRecipesPage = (req,res) => {
  recipe.findAll({
    where: {
      userId: req.user.id
    },
    include: [ingredient]
  })
  .then((recipes)=>{
    res.render('recipe/showAll', { recipes: recipes });
  });
};

const getAllRecipesPage = (req,res) => {
  recipe.findAll({ include: [ingredient] })
  .then((recipes)=>{
    res.render('recipe/showAll', { recipes: recipes });
  });
};

const getNewRecipePage = (req,res) => {
  res.render('recipe/new');
};

const postNewRecipe = (req,res) => {
  let instructions = req.body.instructions.split(',')
  let ingredients = req.body.ingredients.split(',')
  recipe.create({
    name: req.body.name,
    cookTime: req.body.cookTime,
    prepTime: req.body.prepTime,
    instructions: instructions
  })
  .then((recipe)=>{
    ingredients.forEach( async (ingredient)=>{
      let splitIngredients = ingredient.split(' ')
      let name = splitIngredients[splitIngredients.length-1]
      let amount = splitIngredients.slice(0,splitIngredients.length-1)
      await recipe.createIngredient({
        name: name,
        amount: amount,
      });
    });
    return recipe.id;
  })
  .then((id)=>{
   res.redirect(`/recipe/${id}`);
  });
};

const getRecipePage = (req,res) => {
  recipe.findByPk(req.params.id, {
    include: [ingredient]
  })
  .then((recipe)=>{
    console.log(recipe.ingredients[0].dataValues.name);
    res.render('recipe/show', { recipe: recipe });
  });
};

const deleteRecipe = (req,res) => {
  recipe.destroy({
    where: { id: req.params.id },
    include: [ingredient]
  })
  .then(()=>{
    res.send('/recipe');
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

router.get('/', getUserRecipesPage);
router.get('/all', getAllRecipesPage)
router.get('/new', getNewRecipePage);
router.post('/new', postNewRecipe);
router.get('/:id', getRecipePage);
router.delete('/:id/delete', deleteRecipe);
router.get('/:id/edit', getEditRecipePage);
router.put('/:id/edit', editRecipe);


module.exports = router;