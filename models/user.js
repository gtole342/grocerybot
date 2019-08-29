'use strict';

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide your name.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 32],
          msg: 'Your password should be between 8 and 32 characters in length.'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (pendingUser)=> {
        if(pendingUser && pendingUser.password){
          pendingUser.password = bcrypt.hashSync(pendingUser.password, 12);
        }
      }
    }
  });
  user.associate = function(models) {
    // associations can be defined here
    models.user.belongsToMany(models.recipe, {through: 'userRecipes'});
    models.user.belongsToMany(models.mealplan, {through: 'mealplanRecipes'});
  };
  user.prototype.validPassword = function(typedInPassword){
    return bcrypt.compareSync(typedInPassword, this.password)
  };
  
  return user;
};