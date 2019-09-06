'use strict';
module.exports = (sequelize, DataTypes) => {
  const mealplansRecipes = sequelize.define('mealplansRecipes', {
    mealplanId: DataTypes.INTEGER,
    recipeId: DataTypes.INTEGER
  }, {});
  mealplansRecipes.associate = function(models) {
    // associations can be defined here
  };
  return mealplansRecipes;
};