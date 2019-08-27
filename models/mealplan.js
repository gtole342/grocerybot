'use strict';
module.exports = (sequelize, DataTypes) => {
  const mealplan = sequelize.define('mealplan', {
    sunday: DataTypes.INTEGER,
    monday: DataTypes.INTEGER,
    tuesday: DataTypes.INTEGER,
    wednesday: DataTypes.INTEGER,
    thursday: DataTypes.INTEGER,
    friday: DataTypes.INTEGER,
    saturday: DataTypes.INTEGER,
    weekdate: DataTypes.STRING
  }, {});
  mealplan.associate = function(models) {
    // associations can be defined here
  };
  return mealplan;
};