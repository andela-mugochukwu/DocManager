'use strict';

/**
 * Creates the document model
 * @param {object} sequelize - the sequelize object to use in defining the model
 * @param {object} DataTypes - represents the datatypes to be used on the model
 * @return {object} returns the roles created
 */
module.exports = function (sequelize, DataTypes) {
  var Roles = sequelize.define('Roles', {
    roletype: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: {
          arg: [2, 10],
          msg: 'Role should contain between 2 to 10 character'
        }
      }
    }
  }, {
    classMethods: {
      associate: function associate(models) {
        // associations can be defined here
        // Many users can be in the same role
        Roles.hasMany(models.User, {
          foreignKey: 'roleId',
          as: 'users'
        });
      }
    }
  });
  return Roles;
};