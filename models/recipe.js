'use strict';
module.exports = (sequelize, DataTypes) => {
  const recipe = sequelize.define('recipe', {
    cookTime: DataTypes.STRING,
    prepTime: DataTypes.STRING,
    name: DataTypes.STRING,
    ingredients: DataTypes.STRING,
    instructions: DataTypes.JSON
  }, {});
  recipe.associate = function(models) {
    // associations can be defined here
  };
  return recipe;
};