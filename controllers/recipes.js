const router = require('express').Router();
const db = require('../models');
const data = require('../testData');

router.get('/', (req,res)=>{
  db.recipes.findAll()
  .then((recipes)=>{
    res.render('recipes/show', { recipes: recipes });
  });
});


router.get('/new', (req,res)=>{
  res.render('recipes/new');
});
router.post('/new', (req,res)=>{
  db.recipes.create({
    name: req.body.name,
    cookTime: req.body.cookTime,
    prepTime: req.body.prepTime,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions
  })
  .then(()=>{
    res.send('MADE A NEW ONE')
  });
});


router.get('/:id', (req,res)=>{
  db.recipes.findByPk(req.params.id)
  .then((recipe)=>{
    res.render('recipes/show', { recipe: recipe });
  });
});


router.delete('/:id/delete', (req,res)=>{
  db.recipes.destroy({where: { id: req.params.id }}).then(()=>{
    res.send('THAT SHIT IS GONE');
  })
});


router.get('/:id/edit', (req,res)=>{
  db.recipes.findByPk(req.params.id).then((recipe)=>{
  res.render('recipes/edit', { recipe: recipe});
  });
});
router.put('/:id/edit', (req,res)=>{
  db.recipes.update({
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