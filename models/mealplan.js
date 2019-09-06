'use strict';
module.exports = (sequelize, DataTypes) => {
  const mealplan = sequelize.define('mealplan', {
    weekdate: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  mealplan.associate = function(models) {
    models.mealplan.belongsToMany(models.recipe, {through: 'mealplansRecipes'});
    models.mealplan.belongsTo(models.user);
  };
  return mealplan;
};