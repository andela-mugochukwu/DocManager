'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _users = require('../mocks/users');

var _models = require('../../server/models');

var _models2 = _interopRequireDefault(_models);

var _validation = require('../../server/middlewares/validation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = require('chai').expect;

describe('Validation functions:', function () {
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

  describe('generalValidation()', function () {
    it('should throw error when script char (<,>) is used', function () {
      var user = (0, _validation.generalValidation)('<script>alert(\'I Love you\')</script>', 'username');
      expect(user.status).to.equal('unsuccessful');
      expect(user.message.includes('\nInvalid input character(s)')).to.equal(true);
    });

    it('should pass when no script char (<,>) is used', function () {
      var user = (0, _validation.generalValidation)('testing1');
      expect(user.status).to.equal('successful');
      expect(user.message.includes('\nInvalid input character(s)')).to.equal(false);
    });

    it('should throw error when user field is empty', function () {
      var user = (0, _validation.generalValidation)('', 'username');
      expect(user.status).to.equal('unsuccessful');
      expect(user.message.includes('\nEmpty or invalid username field!')).to.equal(true);
    });

    it('should not throw error when user field is correctly filled', function () {
      var user = (0, _validation.generalValidation)('peace', 'password');
      expect(user.status).to.equal('successful');
      expect(user.message.length).to.equal(0);
    });

    it('Should throw error when null or undefined value is submitted', function () {
      var user = (0, _validation.generalValidation)(null, 'username');
      expect(user.status).to.equal('unsuccessful');
      expect(user.message.includes('\nEmpty or invalid username field!')).to.equal(true);
      user = (0, _validation.generalValidation)(undefined, 'password');
      expect(user.status).to.equal('unsuccessful');
      expect(user.message.includes('\nEmpty or invalid password field!')).to.equal(true);
    });
  });

  describe('validateEmail()', function () {
    it('Should accept correct emails', function () {
      var email = (0, _validation.validateEmail)('kingsleyu13@gmail.com');
      expect(email.status).to.equal('successful');
      email = (0, _validation.validateEmail)('chima.eze.go@lycos.com.ng');
      expect(email.status).to.equal('successful');
    });

    it('Should reject incorrect emails', function () {
      var email = (0, _validation.validateEmail)('kingsleyu13gmail.com');
      expect(email.status).to.equal('unsuccessful');
      email = (0, _validation.validateEmail)('fich@jame@gmail.com');
      expect(email.status).to.equal('unsuccessful');
      email = (0, _validation.validateEmail)('fichame@yahoo.co.uk');
      expect(email.status).to.equal('successful');
    });

    it('Should return correct error message when email validation fails', function () {
      var email = (0, _validation.validateEmail)('yuuuuuu.com');
      expect(email.status).to.equal('unsuccessful');
      expect(email.message.includes('\nEmail has got wrong format')).to.equal(true);
    });

    it('should throw error when empty', function () {
      var email = (0, _validation.validateEmail)('');
      expect(email.status).to.equal('unsuccessful');
    });
  });

  describe('validatePassword:', function () {
    it('should be at least 6 characters', function () {
      var password = (0, _validation.validatePassword)('testi');
      expect(password.status).to.equal('unsuccessful');
      expect(password.message.includes('\nPassword length must be between 6 and 20')).to.equal(true);
      password = (0, _validation.validatePassword)('testin');
      expect(password.status).to.equal('successful');
    });

    it('should be at most 20 characters', function () {
      var password = (0, _validation.validatePassword)('testikhdhfh68dskksdhflfs9878s9ss');
      expect(password.status).to.equal('unsuccessful');
      expect(password.message.includes('\nPassword length must be between 6 and 20')).to.equal(true);
    });

    it('should be between 6 and 20 both inclusive characters', function () {
      var password = (0, _validation.validatePassword)('merrymaking');
      expect(password.status).to.equal('successful');
      expect(password.message.includes('\nPassword length must be between 6 and 20')).to.equal(false);
    });

    it('should not display error message when no input is found', function () {
      var password = (0, _validation.validatePassword)('');
      expect(password.status).to.equal('unsuccessful');
      expect(password.message.includes('\nPassword length must be between 6 and 20')).to.equal(false);
    });
  });

  describe('SignIn and SignUp validation: ', function () {
    var userDetail = _users.testUser;

    describe('SignInValidation()', function () {
      before(function (done) {
        (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function () {
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
        }).catch(function () {
          done();
        });
      });

      it('Should return error message when empty form is sent', function (done) {
        (0, _supertest2.default)(_app2.default).post('/api/v1/users/login').send({}).end(function (err, res) {
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.statusCode).to.equal(400);
          expect(res.body.message.includes('\nEmpty forms are not allowed!')).to.equal(true);
          done();
        });
      });

      it('Should move to the next function when form submitted is valid', function (done) {
        (0, _supertest2.default)(_app2.default).post('/api/v1/users/login').send(userDetail).end(function (err, res) {
          expect(res.body.status).to.equal('successful');
          done();
        });
      });

      it('Should throw correct error message when username has a wrong format', function (done) {
        (0, _supertest2.default)(_app2.default).post('/api/v1/users/login').send({
          userName: '',
          password: 'testing1'
        }).end(function (err, res) {
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.statusCode).to.equal(400);
          expect(res.body.message.includes('\nEmpty or invalid username field!')).to.equal(true);
          done();
        });
      });

      it('Should throw an error message when password is wrong', function (done) {
        (0, _supertest2.default)(_app2.default).post('/api/v1/users/login').send({
          userName: userDetail.userName,
          password: 'dsf'
        }).end(function (req, res) {
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.statusCode).to.equal(400);
          expect(res.body.message[0]).to.equal('\nWrong password');
          done();
        });
      });
    });

    describe('SignUpValidation()', function () {
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
        }).catch(function () {
          done();
        });
      });

      it('should throw error when nothing is submitted', function (done) {
        (0, _supertest2.default)(_app2.default).post('/api/v1/users').send({}).end(function (err, res) {
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.body.message.includes('\nEmpty fields are not allowed')).to.equal(true);
          expect(res.statusCode).to.equal(400);
          done();
        });
      });
      var randomUser = {
        userName: 'jupiter',
        password: '',
        email: 'jupiter@gmai.com',
        isactive: true,
        roleId: 4
      };
      it('Should return an error message when username is not filled', function (done) {
        randomUser.userName = '';
        (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(randomUser).end(function (err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.body.message.includes('\nEmpty or invalid username field!')).to.equal(true);
          done();
        });
      });

      it('Should return an error message when password textbox is not filled', function (done) {
        (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(randomUser).end(function (err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.body.message.includes('\nEmpty or invalid password field!')).to.equal(true);
          done();
        });
      });

      it('Should return an error message when invalid email is sent', function (done) {
        randomUser.email = 'jackson.com';
        (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(randomUser).end(function (req, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.body.message.includes('\nEmail has got wrong format')).to.equal(true);
          done();
        });
      });

      it('Should throw error when signup as admin or superadmin', function (done) {
        randomUser.roleId = 2;
        randomUser.userName = 'janet';
        randomUser.email = 'janet@gmail.com';
        randomUser.password = 'testingw';
        randomUser.isactive = true;
        (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(randomUser).end(function (req, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.body.message.includes('\nInvalid role!')).to.equal(true);
          done();
        });
      });

      it('Should move on to the next function when form is valid', function (done) {
        (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function (req, res) {
          expect(res.statusCode).to.equal(200);
          done();
        });
      });
    });
  });

  describe('createToken()', function () {
    it('should return a token as string when called', function () {
      var user = {
        userName: 'jackson',
        email: 'jackson@gmail.com',
        roleId: '1'
      };
      expect(_typeof((0, _validation.createToken)(user))).to.equal('string');
    });

    it('should return a valid error message when no payload is passed', function () {
      expect((0, _validation.createToken)()).to.equal('No payload to create token');
    });
  });

  describe('verifyToken', function () {
    var userDetail = _users.testUser;
    before(function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function (req, res) {
        userDetail.userId = res.body.userId;
        userDetail.token = res.body.token;
        done();
      });
    });

    after(function (done) {
      var User = _models2.default.User;
      User.findOne({
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

    it('should authenticate the request when valid token is used', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/users/' + userDetail.userId).set({ token: userDetail.token }).end(function (req, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('successful');
        done();
      });
    });

    it('should not authenticate request when \n    unknown user info is embedded in token', function (done) {
      var token = (0, _validation.createToken)({
        userName: 'james',
        password: 'testing',
        email: 'jamaes@yahoo.com'
      });
      (0, _supertest2.default)(_app2.default).get('/api/v1/users/' + userDetail.userId).set({ token: token }).end(function (req, res) {
        expect(res.body.message).to.equal('No user found!');
        expect(res.statusCode).to.equal(400);
        expect(res.body.status).to.equal('unsuccessful');
        done();
      });
    });

    it('should show correct error message when accessing\n    protected route without token', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/users/' + userDetail.userId).end(function (req, res) {
        expect(res.body.message).to.equal('You are not authenticated!');
        done();
      });
    });
  });

  describe('isAdmin()', function () {
    var signUpUser = _users.testUser;
    var newToken = '';
    before(function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(signUpUser).end(function (req, res) {
        newToken = res.body.token;
        done();
      });
    });

    after(function (done) {
      var user = _models2.default.User;
      user.findOne({
        where: {
          username: signUpUser.userName
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

    it('Should allow admin navigate to the next route', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/search/users?q=t').set({ token: adminToken }).end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.paginationMetaData.pageSize).to.equal(1);
        done();
      });
    });

    it('should deny access to other users that are not admin', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/search/users').set({ token: newToken }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('Access denied!');
        done();
      });
    });

    it('Should allow SuperAdmin navigate to the next route', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/search/users?q=t').set({ token: superAdminToken }).end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });

  describe('isSuperAdmin()', function () {
    var signupRequest = _users.testUser;
    var newToken = '';
    beforeEach(function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(signupRequest).end(function (req, res) {
        newToken = res.body.token;
        done();
      });
    });

    afterEach(function (done) {
      var user = _models2.default.User;
      user.findOne({
        where: {
          username: signupRequest.userName
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

    it('Should allow superAdmin navigate to the next route to create a role', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/role').send({ roletype: 'Testers' }).set({ token: superAdminToken }).end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('successful');
        (0, _supertest2.default)(_app2.default).delete('/api/v1/role/' + res.body.role.id).set({ token: superAdminToken }).end(function () {
          done();
        });
      });
    });

    it('should deny access to other users that are not superadmin', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/role').send({ roletype: 'Testers' }).set({ token: newToken }).end(function (req, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('Access denied!');
        done();
      });
    });

    it('should not allow an admin to create a role', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/role').send({ roletype: 'Testers' }).set({ token: adminToken }).end(function (err, res) {
        expect(res.body.message).to.equal('Access denied!');
        expect(res.body.status).to.equal('unsuccessful');
        done();
      });
    });
  });
});