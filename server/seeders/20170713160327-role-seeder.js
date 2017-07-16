module.exports = {
  up(queryInterface) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Roles', [{
      roletype: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      roletype: 'fellow',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      roletype: 'learning',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      roletype: 'pandc',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
