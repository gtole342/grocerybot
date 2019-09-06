const fs = require('fs');
const db = require('../models');
const axios = require('axios');
const app_id = 'd3b0519f';
const app_key = '828784f2cce534a4de0d66a83a4db036';
var contents = fs.readFileSync(__dirname + '/../recipes.txt', 'utf8');
var recipes = JSON.parse(contents);
recipes.forEach(async (recipe)=>{
  var totalCalories = 0;
  var totalProtein = 0;
  var totalFat = 0;
  var totalCarbs = 0;
  for(let key in recipe.ingredients){
    var name = key
    var amount = recipe.ingredients[key]
    var spacePattern = new RegExp(" ","g")
    amount = amount.replace(spacePattern, '%20');
    name = name.replace(spacePattern, '%20');
    let query_string = amount+'%20'+name;
    console.log(query_string)
    let url =  `https://api.edamam.com/api/nutrition-data?app_id=${app_id}&app_key=${app_key}&ingr=${query_string}`
    await axios.get(url).then(response=>{
      console.log(response)
      totalCalories = totalCalories + response.data.calories;
      totalProtein = totalProtein + response.data.totalNutrients.PROCNT.quantity;
      totalFat = totalFat + response.data.totalNutrients.FAT.quantity;
      totalCarbs = totalCarbs + response.data.totalNutrients.CHOCDF.quantity;
    })
    .catch(error=>{
      console.log(error);
    });
  }
  console.log(totalCalories)
  console.log(totalProtein)
  console.log(totalFat)
  console.log(totalCarbs)
  db.recipe.create({
    name: recipe.name,
    instructions: recipe.instructions,
    calorie: totalCalories,
    protein: totalProtein,
    fat: totalFat,
    carbs: totalCarbs
  })
  .then( async (r)=>{
    for(var key in recipe.ingredients){
      await db.ingredient.findOrCreate({
        where : {
          name: key,
          amount: recipe.ingredients[key]

        }
      })
      .spread((ingredient, created)=>{
        r.addIngredient(ingredient)
        .then(()=>{
          console.log('Success!');
        });
      });
    }
  });
});