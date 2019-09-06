'use strict';
module.exports = (sequelize, DataTypes) => {
  const ingredient = sequelize.define('ingredient', {
    name: DataTypes.STRING,
    amount: DataTypes.STRING
  }, {});
  ingredient.associate = function(models) {
    models.ingredient.belongsToMany(models.recipe, {through: 'recipesIngredients'});
  };
  return ingredient;
};