'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('mealplans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sunday: {
        type: Sequelize.INTEGER
      },
      monday: {
        type: Sequelize.INTEGER
      },
      tuesday: {
        type: Sequelize.INTEGER
      },
      wednesday: {
        type: Sequelize.INTEGER
      },
      thursday: {
        type: Sequelize.INTEGER
      },
      friday: {
        type: Sequelize.INTEGER
      },
      saturday: {
        type: Sequelize.INTEGER
      },
      weekdate: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('mealplans');
  }
};