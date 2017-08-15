import bcrypt from 'bcrypt-nodejs';

const salt = bcrypt.genSaltSync(10);

/**
 * Creates the document model
 * @param {object} sequelize - the sequelize object to use in defining the model
 * @param {object} DataTypes - represents the datatypes to be used on the model
 * @return {object} returns the document created
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: ['^[a-z]+$', 'i'],
          msg: 'username should contain only alphabets'
        },
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
          arg: [6, 20],
          msg: 'password length should be between 6 to 20 characters'
        },
      } },
    isactive: { type: DataTypes.BOOLEAN,
      allowNull: false },
    roleId: { type: DataTypes.INTEGER,
      allowNull: false },
  }, {
    classMethods: {
      associate: (models) => {
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
      beforeCreate(registeringUser) {
        registeringUser.password =
        bcrypt.hashSync(registeringUser.password, salt);
      },
      beforeUpdate(updatingUser) {
        updatingUser.password = bcrypt.hashSync(updatingUser.password, salt);
      }
    }
  });
  return User;
};
