'use strict';

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _users = require('../mocks/users');

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;

describe('user controller:', function () {
  var superAdminToken = void 0;
  var adminToken = void 0;
  before(function (done) {
    // login admin account
    (0, _supertest2.default)(_app2.default).post('/api/v1/users/login').send(_users.admin).end(function (err, res) {
      adminToken = res.body.token;
      done();
    });
  });

  before(function (done) {
    // login superadmin account
    (0, _supertest2.default)(_app2.default).post('/api/v1/users/login').send(_users.superAdmin).end(function (err, res) {
      superAdminToken = res.body.token;
      done();
    });
  });

  describe('signUp: ', function () {
    var userDetail = _users.testUser;
    afterEach(function (done) {
      var user = _models2.default.User;
      user.findOne({
        where: {
          username: userDetail.userName
        }
      }).then(function (userFound) {
        if (userFound) {
          userFound.destroy();
        }
        done();
      }).catch(function () {
        done();
      });
    });

    it('should Add user info to database when all form fields\n    are correctly filled', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.body.userName).to.equal('jackson');
        expect(res.body.email).to.equal('jackson@gmail.com');
        expect(res.body.roleType).to.equal('Fellow');
        expect(res.statusCode).to.equal(200);
        expect(res.body.token).to.not.be.null;
        done();
      });
    });

    it('should not create user that already exist', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function () {
        (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function (err, res) {
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.statusCode).to.equal(400);
          expect(res.body.message).to.equal('User already exist');
          done();
        });
      });
    });

    it('should throw error when invalid form is posted', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send({
        userName: 'jadofd',
        userEmail: '@mail.com'
      }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message.length).to.equal(2);
        done();
      });
    });

    it('should throw error when isactive status is not set', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send({
        userName: 'miracle',
        email: 'miracle@gmail.com',
        password: 'testing1'
      }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message.includes('Set "isactive" property')).to.equal(true);
        done();
      });
    });
  });

  describe('signIn: ', function () {
    var userDetail = _users.testUser;
    beforeEach(function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function (err, res) {
        userDetail.userId = res.body.userId;
        done();
      });
    });

    afterEach(function (done) {
      userDetail.userName = 'jackson';
      userDetail.password = 'testing1';
      var user = _models2.default.User;
      user.findOne({
        where: {
          username: userDetail.userName
        }
      }).then(function (userFound) {
        if (userFound) {
          userFound.destroy();
        }
        done();
      }).catch();
    });

    it('should return status as successful when\n    the user is successfully authenticated', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users/login').send(userDetail).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.body.userName).to.equal('jackson');
        expect(res.body.email).to.equal('jackson@gmail.com');
        expect(res.body.roleType).to.equal('Fellow');
        done();
      });
    });

    it('should throw error when user dont exist in the database', function (done) {
      var test = { userName: 'jacob', password: 'testing1' };
      (0, _supertest2.default)(_app2.default).post('/api/v1/users/login').send(test).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message.includes('Wrong username!')).to.equal(true);
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should return valid error message when a\n    deactivated user tries to signup', function (done) {
      // deactivate user
      (0, _supertest2.default)(_app2.default).delete('/api/v1/users/' + userDetail.userId).set({ token: superAdminToken }).end(function () {
        (0, _supertest2.default)(_app2.default).post('/api/v1/users/login').send(userDetail).end(function (err, res) {
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.body.message).to.equal('user is inactive');
          expect(res.statusCode).to.equal(400);
          done();
        });
      });
    });

    it('should throw error when password is invalid', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users/login').send({
        userName: userDetail.userName,
        password: 'saints'
      }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message.includes('Wrong password!')).to.equal(true);
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should not signin a user when no password is inputed', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users/login').send({
        userName: userDetail.userName,
        password: null
      }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should not signin a user when no username is inputed', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users/login').send({
        userName: undefined,
        password: 'testing1'
      }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.statusCode).to.equal(400);
        done();
      });
    });
  });

  describe('viewProfile: ', function () {
    var userDetail = _users.testUser;
    var userId = void 0;
    var token = void 0;
    before(function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function (err, res) {
        userId = res.body.userId;
        token = res.body.token;
        done();
      });
    });

    after(function (done) {
      var user = _models2.default.User;
      user.findOne({
        where: {
          username: userDetail.userName
        }
      }).then(function (userFound) {
        if (userFound) {
          userFound.destroy();
        }
        done();
      }).catch();
    });

    it('should fail when no token is passed before viewing user profile', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/users/' + userId).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('You are not authenticated!');
        done();
      });
    });

    it('should fail when invalid token is passed', function (done) {
      var userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC';
      (0, _supertest2.default)(_app2.default).get('/api/v1/users/' + userId).set({ token: userToken }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('You are not authenticated!');
        done();
      });
    });

    it('should return user detail when valid token is passed', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/users/' + userId).set({ token: token }).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('should not allow other users to access a particular user\'s profile', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/users/' + (userId - 4)).set({ token: token }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('You cannot view another user\'s detail');
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should return correct error message when userid is not a number', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/users/a4').set({ token: token }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('Error due to invalid user!');
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should prevent a deactivated user from viewing\n    their profile', function (done) {
      // deactivate user
      (0, _supertest2.default)(_app2.default).delete('/api/v1/users/' + userId).set({ token: superAdminToken }).end(function () {
        (0, _supertest2.default)(_app2.default).get('/api/v1/users/' + userId).set({ token: token }).end(function (err, res) {
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.body.message).to.equal('Inactive user!');
          expect(res.statusCode).to.equal(400);
          done();
        });
      });
    });
  });

  describe('getAll: ', function () {
    var userDetail = _users.testUser;
    var userToken = void 0;
    var User = _models2.default.User;
    before(function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function (req, res) {
        userToken = res.body.token;
        User.bulkCreate(_users2.default).then(function () {
          return User.findAll();
        }).then(function () {
          done();
        }).catch(function (err) {
          done(err);
        });
      });
    });

    after(function (done) {
      User.findOne({
        where: {
          username: userDetail.userName
        }
      }).then(function (userFound) {
        if (userFound) {
          userFound.destroy();
        }
        User.destroy({
          where: {
            roleId: { $notIn: [1, 2] }
          }
        });
        done();
      }).catch(function () {
        done();
      });
    });

    it('Should deny access to unauthenticated user from viewing all users', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/users').set({}).end(function (err, res) {
        expect(res.body.message).to.equal('You are not authenticated!');
        expect(res.body.status).to.equals('unsuccessful');
        done();
      });
    });

    it('Should deny a regular user from viewing all users route', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/users').set({ token: userToken }).end(function (err, res) {
        expect(res.body.message).to.equal('Access denied!');
        expect(res.body.status).to.equal('unsuccessful');
        done();
      });
    });

    it('Should allow admin to view all users in the database', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/users').set({ token: adminToken }).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.statusCode).to.equal(200);
        expect(res.body.users.length).to.equal(8);
        done();
      });
    });

    it('Should allow superadmin to view all users in the database', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/users?offset=4').set({ token: superAdminToken }).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.statusCode).to.equal(200);
        expect(res.body.users.length).to.equal(5);
        done();
      });
    });

    it('Should reset limit and offset to 8 and 0 respectively when\n    they are not set', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/users?offset=null&limit=null').set({ token: superAdminToken }).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.statusCode).to.equal(200);
        expect(res.body.users.length).to.equal(8);
        done();
      });
    });
  });

  describe('find: ', function () {
    var userDetail = _users.testUser;
    var userToken = void 0;
    var User = _models2.default.User;
    before(function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function (req, res) {
        userToken = res.body.token;
        User.bulkCreate(_users2.default).then(function () {
          return User.findAll();
        }).then(function () {
          // allUsers = users.map(user => user.dataValues);
          done();
        }).catch(function (err) {
          done(err);
        });
      });
    });

    after(function (done) {
      User.findOne({
        where: {
          username: userDetail.userName
        }
      }).then(function (userFound) {
        if (userFound) {
          userFound.destroy();
        }
        User.destroy({
          where: {
            roleId: { $notIn: [1, 2] }
          }
        });
        done();
      }).catch(function () {
        done();
      });
    });

    it('Should deny access to unauthenticated user\n    from searching through users', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/search/users').end(function (err, res) {
        expect(res.body.message).to.equal('You are not authenticated!');
        expect(res.body.status).to.equal('unsuccessful');
        done();
      });
    });

    it('Should deny a regular user from searching through users', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/search/users?q=te&limit=8').set({ token: userToken }).end(function (err, res) {
        expect(res.body.message).to.equal('Access denied!');
        expect(res.body.status).to.equal('unsuccessful');
        done();
      });
    });

    it('Should return an error message when a search request is\n    sent without a search string', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/search/users?q=&limit=8').set({ token: adminToken }).end(function (err, res) {
        expect(res.body.message).to.equal('No username to search for!');
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('Should allow superadmin to search through users in the database', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/search/users?q=r&offset=0').set({ token: superAdminToken }).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.statusCode).to.equal(200);
        expect(res.body.users.length).to.equal(3);
        expect(res.body.paginationMetaData.pageSize).to.equal(3);
        done();
      });
    });
  });

  describe('update: ', function () {
    var userDetail = _users.testUser;
    beforeEach(function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function (err, res) {
        userDetail.userId = res.body.userId;
        userDetail.token = res.body.token;
        done();
      });
    });

    afterEach(function (done) {
      var user = _models2.default.User;
      user.findOne({
        where: {
          username: userDetail.userName
        }
      }).then(function (userFound) {
        if (userFound) {
          userFound.destroy();
        }
        done();
      }).catch(function () {
        done();
      });
    });

    it('should update a user\'s email successfully when their id\n        is correct and their updated info is valid', function (done) {
      (0, _supertest2.default)(_app2.default).put('/api/v1/users/' + userDetail.userId).send({ email: 'jacksonOM@gmail.com' }).set({ token: userDetail.token }).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('should not allow a user to update other user\'s profile', function (done) {
      (0, _supertest2.default)(_app2.default).put('/api/v1/users/' + (userDetail.userId - 4)).send({ email: 'newJohn1@gmail.com' }).set({ token: userDetail.token }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('No user found!');
        done();
      });
    });

    it('should fail to update a user\'s email when their id\n    is correct and their updated email is invalid', function (done) {
      (0, _supertest2.default)(_app2.default).put('/api/v1/users/' + userDetail.userId).send({ email: 'newJohn1gmail.com' }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should fail to update a user\'s role unless by the superadmin', function (done) {
      (0, _supertest2.default)(_app2.default).put('/api/v1/users/' + userDetail.userId).send({ roleId: 4 }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.statusCode).to.equal(400);
        done();
      });
    });
  });

  describe('Delete: ', function () {
    var userDetail = _users.testUser;
    var userToken = void 0;
    var userId = void 0;
    beforeEach(function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function (err, res) {
        userId = res.body.userId;
        userToken = res.body.token;
        done();
      });
    });

    afterEach(function (done) {
      var user = _models2.default.User;
      user.findOne({
        where: {
          username: userDetail.userName
        }
      }).then(function (userFound) {
        if (userFound) {
          userFound.destroy();
        }
        done();
      }).catch(function () {
        done();
      });
    });

    it('should not deactivate a user when not logged in as admin', function (done) {
      (0, _supertest2.default)(_app2.default).delete('/api/v1/users/' + userId).set({ token: userToken }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('Access denied!');
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should return error message when an unauthenticated \n      user tries to deactivate a user', function (done) {
      (0, _supertest2.default)(_app2.default).delete('/api/v1/users/' + userId).set({ token: userToken + 'sserede' }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('You are not authenticated!');
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it('should return error message when an admin enters \n    an invalid user id to deactivate', function (done) {
      (0, _supertest2.default)(_app2.default).delete('/api/v1/users/8a').set({ token: superAdminToken }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.statusCode).to.equal(500);
        expect(res.body.message).to.equal('Invalid user ID!');
        done();
      });
    });

    it('should allow admin to successfully deactivate\n      a user', function (done) {
      (0, _supertest2.default)(_app2.default).delete('/api/v1/users/' + userId).set({ token: superAdminToken }).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('should throw correct error message when\n      superAdmin enters a user ID that isnt in the database', function (done) {
      (0, _supertest2.default)(_app2.default).delete('/api/v1/users/1500').set({ token: superAdminToken }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('Could not find any user!');
        done();
      });
    });
  });
});