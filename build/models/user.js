'use strict';

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var salt = _bcryptNodejs2.default.genSaltSync(10);

/**
 * Creates the document model
 * @param {object} sequelize - the sequelize object to use in defining the model
 * @param {object} DataTypes - represents the datatypes to be used on the model
 * @return {object} returns the document created
 */
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          arg: [2, 20],
          msg: 'username should be between 2 to 20 letters'
        }
      }
    },
    email: { type: DataTypes.STRING,
      allowNull: false },
    password: { type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          arg: [6, 50],
          msg: 'password length should be between 6 to 50 characters'
        }
      } },
    isactive: { type: DataTypes.BOOLEAN,
      allowNull: false },
    roleId: { type: DataTypes.INTEGER,
      allowNull: false }
  }, {
    classMethods: {
      associate: function associate(models) {
        // associations can be defined here
        // a user can have multiple documents
        User.hasMany(models.Document, {
          foreignKey: 'userId',
          as: 'documents'
        });
        // a user can only belong to a certain role
        User.belongsTo(models.Roles, {
          foreignKey: 'roleId',
          onDelete: 'CASCADE'
        });
      }
    },
    hooks: {
      beforeCreate: function beforeCreate(registeringUser) {
        registeringUser.password = _bcryptNodejs2.default.hashSync(registeringUser.password, salt);
      },
      beforeUpdate: function beforeUpdate(updatingUser) {
        updatingUser.password = _bcryptNodejs2.default.hashSync(updatingUser.password, salt);
      }
    }
  });
  return User;
};