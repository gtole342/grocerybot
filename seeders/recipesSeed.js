const fs = require('fs');
const db = require('../models');

var contents = fs.readFileSync(__dirname + '/../recipes.txt', 'utf8');
var recipes = JSON.parse(contents);
recipes.forEach((recipe)=>{
  db.recipe.findOrCreate({
   where: {
    name: recipe.name
  },
  defaults: {
    instructions: recipe.instructions
  }
  }).spread((recipe, created)=>{
    for(var key in recipe.ingredients){
      db.ingredient.findOrCreate({
        where : {
          name: key,
          amount: recipe.ingredients[key]
        }
      })
      .spread((ingredient, created)=>{
        recipe.addIngredient(ingredient)
        .then(()=>{
          console.log('Success!');
        });
      });
    }
  });
});