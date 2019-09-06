'use strict';
module.exports = (sequelize, DataTypes) => {
  const recipesIngredients = sequelize.define('recipesIngredients', {
    recipeId: DataTypes.INTEGER,
    ingredientId: DataTypes.INTEGER
  }, {});
  recipesIngredients.associate = function(models) {
    // associations can be defined here
  };
  return recipesIngredients;
};