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
      roletype: 'SuperAdmin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      roletype: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      roletype: 'Fellow',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      roletype: 'Learning',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      roletype: 'Devops',
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
