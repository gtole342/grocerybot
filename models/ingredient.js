'use strict';
module.exports = (sequelize, DataTypes) => {
  const ingredient = sequelize.define('ingredient', {
    name: DataTypes.STRING,
    amount: DataTypes.STRING
  }, {});
  ingredient.associate = function(models) {
    // associations can be defined here
    models.ingredient.belongsToMany(models.recipe, {through: 'recipeIngredients'});
  };
  return ingredient;
};