'use strict';

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _users = require('../mocks/users');

var _documents = require('../mocks/documents');

var _documents2 = _interopRequireDefault(_documents);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;

describe('Document controllers:', function () {
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

  describe('Creating Document', function () {
    var userDetail = _users.testUser;
    var userDocument = _documents2.default[0];
    var userToken = void 0;
    var userId = void 0;
    before(function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function (err, res) {
        userToken = res.body.token;
        userId = res.body.userId;
        done();
      });
    });

    beforeEach(function () {
      userDocument.title = _documents2.default[0].title;
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
      }).catch(function (err) {
        done(err);
      });
    });

    it('should not create a document with empty\n    title', function (done) {
      userDocument.title = '';
      userDocument.token = userToken;
      (0, _supertest2.default)(_app2.default).post('/api/v1/documents').send(userDocument).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('Empty title or body or access field!');
        done();
      });
    });

    it('should not create a document with empty\n    body', function (done) {
      userDocument.title = 'I want to play chess';
      userDocument.body = '';
      (0, _supertest2.default)(_app2.default).post('/api/v1/documents').send(userDocument).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('Empty title or body or access field!');
        done();
      });
    });

    it('should not create a document with empty\n    access field', function (done) {
      userDocument.body = 'Who asked you that question';
      userDocument.access = null;
      (0, _supertest2.default)(_app2.default).post('/api/v1/documents').send(userDocument).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('Empty title or body or access field!');
        done();
      });
    });

    it('should not create a document with no\n    user token', function (done) {
      userDocument.access = 'Private';
      userDocument.token = null;
      (0, _supertest2.default)(_app2.default).post('/api/v1/documents').send(userDocument).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('You are not authenticated!');
        done();
      });
    });

    it('should create document when user is authenticated\n    and is creating a valid document', function (done) {
      userDocument.userId = userId;
      userDocument.token = userToken;
      userDocument.access = 'Private';
      (0, _supertest2.default)(_app2.default).post('/api/v1/documents').send(userDocument).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('should not create a document whose\n    title already exists', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/documents').send(userDocument).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('Document already exist!');
        done();
      });
    });
  });

  describe('Finding a document', function () {
    var userDetail = _users.testUser;
    var userDocument = _documents2.default[0];
    var userToken = void 0;
    var allDocuments = void 0;
    before(function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function (err, res) {
        userDocument.userId = res.body.userId;
        userDocument.token = res.body.token;
        userToken = res.body.token;
        (0, _supertest2.default)(_app2.default).post('/api/v1/documents').send(userDocument).end(function (err, res3) {
          userDocument.docId = res3.body.documentId;
          var Document = _models2.default.Document;
          var newMockDocuments = _documents2.default.map(function (mockDocument) {
            mockDocument.userId = res.body.userId;
            return mockDocument;
          });
          Document.bulkCreate(newMockDocuments).then(function () {
            return Document.findAll();
          }).then(function (documents) {
            allDocuments = documents.map(function (document) {
              return document.dataValues;
            });
            done();
          }).catch(function () {
            done();
          });
        });
      });
    });
    var User = _models2.default.User;
    after(function (done) {
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
    it('should throw error for invalid document ID', function (done) {
      userDetail.token = userToken;
      (0, _supertest2.default)(_app2.default).get('/api/v1/document/2e').set({ token: userToken }).end(function (err, res) {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('Invalid search parameter!');
        done();
      });
    });

    it('should throw error when document dont exist', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/document/34534594').set({ token: userToken }).end(function (err, res) {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('An error coccured while loading your document!');
        expect(res.body.status).to.equal('unsuccessful');
        done();
      });
    });

    it('should allow access to a private document by its owner', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/document/' + userDocument.docId).set({ token: userToken }).end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('successful');
        done();
      });
    });

    it('should allow an admin user to access a private document', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/document/' + userDocument.docId).set({ token: adminToken }).end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('successful');
        done();
      });
    });

    it('should allow a superadmin user to access a private document', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/document/' + userDocument.docId).set({ token: superAdminToken }).end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('successful');
        done();
      });
    });

    it('should allow a user to access a public document', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/document/' + allDocuments[0].id).set({ token: userToken }).end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('successful');
        done();
      });
    });

    it('should allow a user to access rolebased\n    documents if they are on the same role', function (done) {
      userDocument.token = userToken;
      (0, _supertest2.default)(_app2.default).get('/api/v1/document/' + allDocuments[3].id).set({ token: userToken }).end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('successful');
        done();
      });
    });

    it('should allow Admin to find any document', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/document/' + allDocuments[5].id).set({ token: adminToken }).end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('successful');
        done();
      });
    });

    it('should allow SuperAdmin to find any document', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/document/' + allDocuments[5].id).set({ token: superAdminToken }).end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('successful');
        done();
      });
    });

    it('should deny other users that are not admin or super admin\n     from accessing a document they didnt create', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send({
        userName: 'testjackson',
        password: 'testing1',
        email: 'user1@gmail.com',
        roleId: 4,
        isactive: true
      }).end(function (err, res) {
        userToken = res.body.token;
        (0, _supertest2.default)(_app2.default).get('/api/v1/document/' + allDocuments[5].id).set({ token: userToken }).end(function (err, res1) {
          expect(res1.statusCode).to.equal(400);
          expect(res1.body.status).to.equal('unsuccessful');
          User.findOne({
            where: {
              username: 'testjackson'
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
      });
    });
  });

  describe('updating Document', function () {
    var userDetail = _users.testUser;
    var userDocument = _documents2.default[0];
    var userDocumentUpdate = {
      title: 'Why I love myself as well',
      body: 'Because I show high spirit and devotion',
      access: 'Private'
    };
    var userToken = void 0;
    var allDocuments = void 0;
    before(function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function (err, res) {
        userDocument.userId = res.body.userId;
        userDocument.token = res.body.token;
        userDocumentUpdate.userId = res.body.userId;
        userDocumentUpdate.token = res.body.token;
        userToken = res.body.token;
        (0, _supertest2.default)(_app2.default).post('/api/v1/documents').send(userDocument).end(function (err, res3) {
          userDocument.docId = res3.body.documentId;
          var Document = _models2.default.Document;
          var newMockDocuments = _documents2.default.map(function (mockDocument) {
            mockDocument.userId = res.body.userId;
            return mockDocument;
          });
          Document.bulkCreate(newMockDocuments).then(function () {
            return Document.findAll();
          }).then(function (documents) {
            allDocuments = documents.map(function (document) {
              return document.dataValues;
            });
            done();
          }).catch(function () {
            done();
          });
        });
      });
    });
    var User = _models2.default.User;
    after(function (done) {
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
    it('should throw error when trying to update documents that dont exist', function (done) {
      (0, _supertest2.default)(_app2.default).put('/api/v1/documents/e67w').send(userDocumentUpdate).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('Could not find any document to update!');
        done();
      });
    });

    it('should deny any user from editing a document they didn\'t\n    create except for an admin or super admin', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(_users.testUser1).end(function (err, res) {
        userDocumentUpdate.token = res.body.token;
        (0, _supertest2.default)(_app2.default).put('/api/v1/documents/' + allDocuments[2].id).send(userDocumentUpdate).end(function (err, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body.message).to.equal('Restricted document!');
          expect(res.body.status).to.equal('unsuccessful');
          User.findOne({
            where: {
              username: _users.testUser1.userName
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
      });
    });

    it('should allow Admin to  edit a document they didnt create', function (done) {
      userDocumentUpdate.token = adminToken;
      (0, _supertest2.default)(_app2.default).put('/api/v1/documents/' + allDocuments[2].id).send(userDocumentUpdate).end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('successful');
        done();
      });
    });

    it('should allow SuperAdmin to edit a document they didnt create', function (done) {
      userDocumentUpdate.token = superAdminToken;
      (0, _supertest2.default)(_app2.default).put('/api/v1/documents/' + allDocuments[2].id).send(userDocumentUpdate).end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('successful');
        done();
      });
    });

    it('should return an error message when a user trys\n    to update a document with an empty form', function (done) {
      userDocumentUpdate.token = userToken;
      userDocumentUpdate.title = '';
      userDocumentUpdate.body = '';
      userDocumentUpdate.access = '';
      (0, _supertest2.default)(_app2.default).put('/api/v1/documents/' + allDocuments[2].id).send(userDocumentUpdate).end(function (err, res) {
        expect(res.statusCode).to.equal(400);
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('No new value to update document!');
        done();
      });
    });
  });

  describe('Deleting a document', function () {
    var userDetail = _users.testUser;
    var userDocument = _documents2.default[0];
    var allDocuments = void 0;
    var userToken = void 0;

    before(function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function (err, res) {
        userDocument.userId = res.body.userId;
        userDocument.token = res.body.token;
        userToken = res.body.token;
        (0, _supertest2.default)(_app2.default).post('/api/v1/documents').send(userDocument).end(function (err, res1) {
          userDocument.docId = res1.body.documentId;
          var Document = _models2.default.Document;
          var newMockDocuments = _documents2.default.map(function (mockDocument) {
            mockDocument.userId = res.body.userId;
            return mockDocument;
          });
          Document.bulkCreate(newMockDocuments).then(function () {
            return Document.findAll();
          }).then(function (documents) {
            allDocuments = documents.map(function (document) {
              return document.dataValues;
            });
            done();
          }).catch(function () {
            done();
          });
        });
      });
    });

    var User = _models2.default.User;
    after(function (done) {
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
    it('should not allow an unauthenticated user to delete any document', function (done) {
      (0, _supertest2.default)(_app2.default).delete('/api/v1/documents/' + allDocuments[3].id).set({ token: '' }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('You are not authenticated!');
        done();
      });
    });

    it('should fail to delete document with invalid ID', function (done) {
      (0, _supertest2.default)(_app2.default).delete('/api/v1/documents/52').set({ token: userToken }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('Could not find document!');
        done();
      });
    });

    it('should successfully delete a document owned by a user', function (done) {
      (0, _supertest2.default)(_app2.default).delete('/api/v1/documents/' + allDocuments[3].id).set({ token: userToken }).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.body.message).to.equal('"Test spec document 2" has been deleted!');
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('should deny random users access except admin from deleting\n     another users document', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(_users.testUser1).end(function (err, res1) {
        userToken = res1.body.token;
        (0, _supertest2.default)(_app2.default).delete('/api/v1/documents/' + allDocuments[2].id).set({ token: userToken }).end(function (req, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body.message).to.equal('Access denied!');
          expect(res.body.status).to.equal('unsuccessful');
          User.findOne({
            where: {
              username: _users.testUser1.userName
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
      });
    });
  });

  describe('getUserDocument', function () {
    var userDetail = _users.testUser;
    var userDocument = _documents2.default[0];
    var userToken = void 0;
    var allDocuments = void 0;

    before(function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function (err, res) {
        userDocument.userId = res.body.userId;
        userDocument.token = res.body.token;
        userToken = res.body.token;
        (0, _supertest2.default)(_app2.default).post('/api/v1/documents').send(userDocument).end(function (err, res1) {
          userDocument.docId = res1.body.documentId;
          var Document = _models2.default.Document;
          var newMockDocuments = _documents2.default.map(function (mockDocument) {
            mockDocument.userId = res.body.userId;
            return mockDocument;
          });
          Document.bulkCreate(newMockDocuments).then(function () {
            return Document.findAll();
          }).then(function (documents) {
            allDocuments = documents.map(function (document) {
              return document.dataValues;
            });
            done();
          }).catch(function () {
            done();
          });
        });
      });
    });

    var User = _models2.default.User;
    after(function (done) {
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

    it('should get all documents created by a given user', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/users/' + userDocument.userId + '/documents').set({ token: userToken }).end(function (req, res) {
        expect(res.body.count).to.equal(allDocuments.length);
        expect(res.body.status).to.equal('successful');
        done();
      });
    });

    it('should get documents based on the values of offset and limit given', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/users/' + userDocument.userId + '/documents?offset=2&limit2').set({ token: userToken }).end(function (err, res) {
        expect(res.body.documents.length).to.equal(6);
        expect(res.body.status).to.equal('successful');
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('should notify a user when they have not created any document', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(_users.testUser1).end(function (err, res1) {
        userToken = res1.body.token;
        (0, _supertest2.default)(_app2.default).get('/api/v1/users/' + res1.body.userId + '/documents').set({ token: userToken }).end(function (req, res) {
          expect(res.statusCode).to.equal(400);
          expect(res.body.message).to.equal('No document found!');
          expect(res.body.status).to.equal('unsuccessful');
          done();
        });
      });
    });

    it('should deny access to a user without admin rights\n     who wants to view private\n     documents belonging to other users', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/users/' + userDocument.userId + '/documents?offset=2').set({ token: userToken }).end(function (err, res) {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('No document found!');
        expect(res.body.status).to.equal('unsuccessful');
        User.findOne({
          where: {
            username: _users.testUser1.userName
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
    });

    it('should deny an unauthenticated user access to view all documents', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/users/50/documents').end(function (err, res) {
        expect(res.statusCode).to.equal(400);
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('You are not authenticated!');
        done();
      });
    });
  });

  describe('getAll function', function () {
    var userDetail = _users.testUser;
    var userDocument = _documents2.default[0];
    var userToken = void 0;
    var allDocuments = void 0;
    before(function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function (err, res) {
        userDocument.userId = res.body.userId;
        userToken = res.body.token;
        (0, _supertest2.default)(_app2.default).post('/api/v1/documents').send(_documents.adminDocument).end(function (err, res3) {
          _documents.adminDocument.docId = res3.body.documentId;
          var Document = _models2.default.Document;
          var newMockDocuments = _documents2.default.map(function (mockDocument) {
            mockDocument.userId = res.body.userId;
            return mockDocument;
          });
          Document.bulkCreate(newMockDocuments).then(function () {
            return Document.findAll();
          }).then(function (documents) {
            allDocuments = documents.map(function (document) {
              return document.dataValues;
            });
            done();
          }).catch(function () {
            done();
          });
        });
      });
    });
    var User = _models2.default.User;
    var Document = _models2.default.Document;
    after(function (done) {
      User.findOne({
        where: {
          username: userDetail.userName
        }
      }).then(function (userFound) {
        if (userFound) {
          userFound.destroy();
        }
        Document.findOne({
          where: {
            title: _documents.adminDocument.title
          }
        }).then(function (documentFound) {
          if (documentFound) {
            documentFound.destroy();
          }
          done();
        }).catch(function () {
          done();
        });
      }).catch(function () {
        done();
      });
    });

    it('should deny an authenticated user except admin and superadmin\n     access to get all documents', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/documents').set({ token: userToken }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.count).not.to.equal(allDocuments.length);
        done();
      });
    });

    it('should deny unauthenticated users form\n    access to get all documents', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/documents').end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('You are not authenticated!');
        done();
      });
    });

    it('should allow admin to get all documents in the database', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/documents').set({ token: adminToken }).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        done();
      });
    });

    it('should allow superAdmin to get all documents in the database', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/documents').set({ token: superAdminToken }).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.body.count).to.equal(allDocuments.length);
        done();
      });
    });

    it('should allow superAdmin to get atmost 3 documents in the database', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/documents?limit=3').set({ token: superAdminToken }).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.body.count).to.equal(7);
        expect(res.body.documents.length).to.equal(3);
        done();
      });
    });

    it('should allow admin to get all documents from the 3rd document', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/documents?offset=3').set({ token: adminToken }).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.body.count).to.equal(7);
        expect(res.body.documents.length).to.equal(4);
        expect(res.body.documents[0].title).to.equal('Test subordinate document 3');
        done();
      });
    });

    it('should allow a registered user to get all public documents', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/documents/Public').set({ token: userToken }).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.body.count).to.equal(1);
        expect(res.body.documents.length).to.equal(1);
        expect(res.body.documents[0].title).to.equal('Test spec document 1');
        done();
      });
    });

    it('should allow a user to get all documents accessible to them', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/documents/All').set({ token: userToken }).end(function (req, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.body.count).to.equal(7);
        expect(res.body.documents.length).to.equal(7);
        done();
      });
    });

    it('should allow a user to get all role documents accessible to them', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/documents/Fellow').set({ token: userToken }).end(function (req, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.body.count).to.equal(1);
        var roles = res.body.documents.map(function (document) {
          return document.access;
        });
        expect(roles.includes('Learning')).to.equal(false);
        done();
      });
    });

    it('should not allow a user to view documents belonging to another role', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/documents/Learning').set({ token: userToken }).end(function (req, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('Access denied!');
        done();
      });
    });

    it('should not allow a user to view documents belonging to another role', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/documents/Devops').set({ token: userToken }).end(function (req, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('Access denied!');
        done();
      });
    });

    it('should deny regular users from accessing Admin documents', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/documents/Admin').set({ token: userToken }).end(function (req, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('Access denied!');
        done();
      });
    });
    var randomToken = void 0;
    it('should get only "fellow" documents from the database', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send({
        userName: 'user',
        password: 'testing1',
        email: 'user1@gmail.com',
        roleId: 3,
        isactive: true
      }).end(function (err, res1) {
        randomToken = res1.body.token;
        (0, _supertest2.default)(_app2.default).get('/api/v1/documents/Fellow').set({ token: randomToken }).end(function (req, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('successful');
          expect(res.body.documents.length).to.equal(1);
          done();
        });
      });
    });

    it('should deny users access to view documents belonging to other users', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/documents/SuperAdmin?offset=2&limit=8').set({ token: randomToken }).end(function (err, res) {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('Access denied!');
        expect(res.body.status).to.equal('unsuccessful');
        User.findOne({
          where: {
            username: 'user'
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
    });

    it('should deny users access to view documents belonging to other users', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/documents/SuperAdmin').set({ token: superAdminToken }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('No document found!');
        done();
      });
    });
  });

  describe('search function', function () {
    var userDetail = _users.testUser;
    var userDocument = _documents2.default[0];
    var userToken = void 0;
    before(function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/v1/users').send(userDetail).end(function (err, res) {
        userDocument.userId = res.body.userId;
        userDocument.token = res.body.token;
        userToken = res.body.token;
        (0, _supertest2.default)(_app2.default).post('/api/v1/users/login').send(_documents.adminDocument).end(function (err, res3) {
          _documents.adminDocument.docId = res3.body.documentId;
          var Document = _models2.default.Document;
          var newMockDocuments = _documents2.default.map(function (mockDocument) {
            mockDocument.userId = res.body.userId;
            return mockDocument;
          });
          Document.bulkCreate(newMockDocuments).then(function () {
            return Document.findAll();
          }).then(function () {
            done();
          }).catch(function () {
            done();
          });
        });
      });
    });
    var User = _models2.default.User;
    var Document = _models2.default.Document;
    after(function (done) {
      User.findOne({
        where: {
          username: userDetail.userName
        }
      }).then(function (userFound) {
        if (userFound) {
          userFound.destroy();
        }
        Document.findOne({
          where: {
            title: _documents.adminDocument.title
          }
        }).then(function (documentFound) {
          if (documentFound) {
            documentFound.destroy();
          }
          done();
        }).catch(function () {
          done();
        });
      }).catch(function () {
        done();
      });
    });

    it('should return correct error message when no search text is passed\n    to the server', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/search/documents').set({ token: userToken }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('No title to search for!');
        done();
      });
    });

    it('should deny unauthenticated users from searching for\n    any document', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/search/documents?q=the').end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('You are not authenticated!');
        done();
      });
    });

    it('should return an explanatory message when there is no match', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/search/documents?q=the').set({ token: adminToken }).end(function (err, res) {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('No match found!');
        done();
      });
    });

    it('should allow admin to search through all documents in the database', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/search/documents?q=main sub&limit=8').set({ token: adminToken }).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.body.count).to.equal(2);
        done();
      });
    });

    it('should allow superAdmin to search through\n    all documents in the database', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/search/documents?q=main sub&limit=8').set({ token: superAdminToken }).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.body.count).to.equal(2);
        done();
      });
    });

    it('should allow a regular user search \n    through documents accessible to them', function (done) {
      (0, _supertest2.default)(_app2.default).get('/api/v1/search/documents?q=main document&limit=8&offset=0').set({ token: userToken }).end(function (err, res) {
        expect(res.body.status).to.equal('successful');
        expect(res.body.count).to.equal(6);
        var docTitles = res.body.documents.map(function (document) {
          return document.title;
        });
        expect(docTitles.includes('Admin Document')).to.equal(false);
        done();
      });
    });
  });
});