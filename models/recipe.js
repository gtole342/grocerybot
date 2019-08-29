'use strict';
module.exports = (sequelize, DataTypes) => {
  const recipe = sequelize.define('recipe', {
    name: DataTypes.STRING,
    instructions: DataTypes.JSON,
    prep: DataTypes.STRING,
    cook: DataTypes.STRING
  }, {});
  recipe.associate = function(models) {
    // associations can be defined here
    models.recipe.hasMany(models.ingredient);
    models.recipe.belongsToMany(models.mealplan, {through: 'mealplanRecipes'});
    models.recipe.belongsToMany(models.user, {through: 'userRecipes'})
  };
  return recipe;
};