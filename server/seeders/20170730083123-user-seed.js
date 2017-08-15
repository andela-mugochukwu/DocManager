const bcrypt = require('bcrypt-nodejs');

const salt = bcrypt.genSaltSync(10);
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
    return queryInterface.bulkInsert('Users', [{
      username: 'SuperAdmin',
      password: bcrypt.hashSync(process.env.ADMINPASSWORD, salt),
      roleId: 1,
      email: 'superadmin@gmail.com',
      isactive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      username: 'touchstone',
      password: bcrypt.hashSync(process.env.ADMINPASSWORD, salt),
      roleId: 2,
      email: 'touchstone@gmail.com',
      isactive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down() {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
