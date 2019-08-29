const router = require('express').Router();
const recipe = require('../models').recipe;

router.get('/', (req,res)=>{
  recipe.findAll()
  .then((recipes)=>{
    res.render('recipes/show', { recipes: recipes });
  });
});


router.get('/new', (req,res)=>{
  res.render('recipes/new');
});
router.post('/new', (req,res)=>{
  recipe.create({
    name: req.body.name,
    cookTime: req.body.cookTime,
    prepTime: req.body.prepTime,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions
  })
  .then((recipe)=>{
    res.redirect(`/recipes/${recipe.id}`);
  });
});


router.get('/:id', (req,res)=>{
  recipe.findByPk(req.params.id)
  .then((recipe)=>{
    res.render('recipes/show', { recipe: recipe });
  });
});


router.delete('/:id/delete', (req,res)=>{
  recipe.destroy({where: { id: req.params.id }}).then(()=>{
    res.send('THAT SHIT IS GONE');
  });
});


router.get('/:id/edit', (req,res)=>{
  recipe.findByPk(req.params.id).then((recipe)=>{
  res.render('recipes/edit', { recipe: recipe});
  });
});
router.put('/:id/edit', (req,res)=>{
  recipe.update({
    where: {id: req.params.id},
    fields: {
      name: req.body.name,
      cookTime: req.body.cookTime,
      prepTime: req.body.prepTime,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions
    }
  })
  .then(()=>{
    res.redirect(`/recipes/${req.params.id}`);
  });
});


module.exports = router;