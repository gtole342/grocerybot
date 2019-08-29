'use strict';
module.exports = (sequelize, DataTypes) => {
  const mealplan = sequelize.define('mealplan', {
    daterange: DataTypes.STRING
  }, {});
  mealplan.associate = function(models) {
    // associations can be defined here
    models.mealplan.belongsToMany(models.recipe, {through: 'mealplanRecipes'});
    models.mealplan.belongsTo(models.user);
  };
  return mealplan;
};