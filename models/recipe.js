'use strict';
module.exports = (sequelize, DataTypes) => {
  const recipe = sequelize.define('recipe', {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    instructions: DataTypes.JSON,
    calories: DataTypes.STRING,
    protein: DataTypes.FLOAT,
    fat: DataTypes.FLOAT,
    carbs: DataTypes.FLOAT,

  }, {});
  recipe.associate = function(models) {
    models.recipe.belongsToMany(models.ingredient, {through: 'recipesIngredients'});
    models.recipe.belongsToMany(models.mealplan, {through: 'mealplansRecipes'});
    models.recipe.belongsTo(models.user);
  };
  return recipe;
};