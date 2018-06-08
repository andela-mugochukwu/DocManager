'use strict';

/**
 * Creates the document model
 * @param {object} sequelize - the sequelize object to use in defining the model
 * @param {object} DataTypes - represents the datatypes to be used on the model
 * @return {object} returns the document created
 */
module.exports = function (sequelize, DataTypes) {
  var Document = sequelize.define('Document', {
    title: { type: DataTypes.STRING,
      allowNull: false,
      unique: true },
    body: { type: DataTypes.TEXT,
      allowNull: false },
    access: { type: DataTypes.STRING,
      allowNull: false },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function associate(models) {
        // associations can be defined here
        // A document belongs to a particular user
        Document.belongsTo(models.User, {
          foreignKey: 'userId',
          onDelete: 'CASCADE'
        });
      }
    }
  });
  return Document;
};