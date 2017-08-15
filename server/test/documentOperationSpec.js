import request from 'request';
import _ from 'lodash';

import mockDocuments from '../../spec/serverspec/mockDocuments';
import index from '../../server/models';

const chai = require('chai');

const expect = chai.expect;
const routeUrl = 'http://localhost:1844/api/v1';

describe('Creating a document()', () => {
  const docUrl = `${routeUrl}/documents`;
  const userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
    roleId: 3,
    isactive: true,
    userId: 0,
    token: '',
  };

  const userDocument = {
    title: 'Why I love team Gimli.',
    body: 'Team gimli shows high spirit and devotion',
    access: 'Private',
  };
  let userId;
  let userToken;
  const requestObject = {
    url: `${routeUrl}/users`,
    method: 'POST',
    json: userDetail,
  };
  before((done) => {
    request(requestObject, (req, res, body) => {
      userDocument.userId = body.userId;
      userId = body.userId;
      userDocument.token = body.token;
      userToken = body.token;
      done();
    });
  });
  after((done) => {
    const user = index.User;
    user.findOne({
      where: {
        username: userDetail.userName,
      }
    }).then((userFound) => {
      if (userFound) {
        userFound.destroy();
      }
      done();
    }).catch(() => {
      done();
    });
  });
  it(`should not create a document with empty
    title`, (done) => {
    userDocument.title = '';
    requestObject.url = docUrl;
    requestObject.json = userDocument;
    request(requestObject, (req, res, body1) => {
      expect(body1.status).to.equal('unsuccessful');
      expect(res.statusCode).to.equal(400);
      expect(body1.message).to.equal('Empty title or body or access field!');
      done();
    });
  });

  it(`should not create a document with empty
  body`, (done) => {
    userDocument.title = 'I want to play';
    userDocument.body = '';
    requestObject.url = docUrl;
    requestObject.json = userDocument;
    request(requestObject, (req, res, body) => {
      expect(body.status).to.equal('unsuccessful');
      expect(res.statusCode).to.equal(400);
      expect(body.message).to.equal('Empty title or body or access field!');
      done();
    });
  });

  it(`should not create a document with empty
    access field`, (done) => {
    userDocument.body = 'Who asked you that question';
    userDocument.access = null;
    request(requestObject, (req, res, body1) => {
      expect(body1.status).to.equal('unsuccessful');
      expect(res.statusCode).to.equal(400);
      expect(body1.message).to.equal('Empty title or body or access field!');
      done();
    });
  });

  it(`should not create a document with no
    user token`, (done) => {
    userDocument.token = null;
    request(requestObject, (req, res, body1) => {
      expect(body1.status).to.equal('unsuccessful');
      expect(res.statusCode).to.equal(400);
      expect(body1.message).to.equal('You are not authenticated!');
      done();
    });
  });

  it(`should create document when user is authenticated
  and is creating a valid document`, (done) => {
    userDocument.userId = userId;
    userDocument.token = userToken;
    userDocument.access = 'Private';
    request(requestObject, (req, res, body) => {
      expect(body.status).to.equal('successful');
      expect(body.message).to.be.undefined;
      done();
    });
  });

  it(`should not create a document whose
  title already exists`, (done) => {
    request(requestObject, (req, res, body1) => {
      expect(body1.status).to.equal('unsuccessful');
      expect(res.statusCode).to.equal(400);
      expect(body1.message).to.equal('Document already exist!');
      done();
    });
  });
});

describe('Finding a document()', () => {
  let docUrl = `${routeUrl}/documents`;
  const userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
    roleId: 3,
    isactive: true,
  };
  const userDocument = {
    title: 'Why I love team Gimli.',
    body: 'Team gimli shows high spirit and devotion',
    access: 'Private',
  };
  let userToken;
  let adminToken;
  let superAdminToken;
  const userObject = {
    url: `${routeUrl}/users`,
    method: 'POST',
    json: userDetail,
  };
  const adminLogin = {
    url: `${routeUrl}/users/login`,
    method: 'POST',
    json: {
      userName: 'touchstone',
      password: 'testing1',
    }
  };
  const superAdminLogin = {
    url: `${routeUrl}/users/login`,
    method: 'POST',
    json: {
      userName: 'SuperAdmin',
      password: 'testing1',
    }
  };
  const documentObject = {
    url: docUrl,
    method: 'POST',
    json: userDocument,
  };
  let allDocuments;
  before((done) => {
    request(userObject, (req, res, body) => {
      userDocument.userId = body.userId;
      userDocument.token = body.token;
      userToken = body.token;
      request(adminLogin, (req, res, body1) => {
        adminToken = body1.token;
        request(superAdminLogin, (req, res, body2) => {
          superAdminToken = body2.token;
          request(documentObject, (req1, res1, body3) => {
            userDocument.docId = body3.documentId;
            const Document = index.Document;
            const newMockDocuments = mockDocuments.map((mockDocument) => {
              mockDocument.userId = body.userId;
              return mockDocument;
            });
            Document.bulkCreate(newMockDocuments)
            .then(() => Document.findAll()).then((documents) => {
              allDocuments = _.map(documents, document => document.dataValues);
              done();
            }).catch(() => {
              done();
            });
          });
        });
      });
    });
  });
  const User = index.User;
  after((done) => {
    User.findOne({
      where: {
        username: userDetail.userName,
      }
    }).then((userFound) => {
      if (userFound) {
        userFound.destroy();
      }
      done();
    }).catch(() => {
      done();
    });
  });
  it('should throw error for invalid document ID',
  (done) => {
    userObject.method = 'GET';
    docUrl = `${routeUrl}/document`;
    userObject.url = `${docUrl}/2e`;
    userDetail.token = userToken;
    request(userObject, (req, res, body) => {
      expect(res.statusCode).to.equal(400);
      expect(body.message).to.equal('Invalid search parameter!');
      done();
    });
  });

  it('should throw error when document dont exist', (done) => {
    userObject.method = 'GET';
    userObject.url = `${docUrl}/34534594`;
    request(userObject, (req, res, body) => {
      expect(res.statusCode).to.equal(400);
      expect(body.message)
      .to.equal('An error coccured while loading your document!');
      expect(body.status).to.equal('unsuccessful');
      done();
    });
  });

  it('should allow access to a private document by its owner', (done) => {
    documentObject.method = 'GET';
    documentObject.url = `${docUrl}/${userDocument.docId}`;
    request(documentObject, (req, res, body) => {
      expect(res.statusCode).to.equal(200);
      expect(body.status).to.equal('successful');
      done();
    });
  });

  it('should allow an admin user to access a private document', (done) => {
    documentObject.method = 'GET';
    documentObject.url = `${docUrl}/${userDocument.docId}`;
    userDocument.token = adminToken;
    request(documentObject, (req, res, body) => {
      expect(res.statusCode).to.equal(200);
      expect(body.status).to.equal('successful');
      done();
    });
  });

  it('should allow an admin user to access a private document', (done) => {
    documentObject.method = 'GET';
    documentObject.url = `${docUrl}/${userDocument.docId}`;
    userDocument.token = superAdminToken;
    request(documentObject, (req, res, body) => {
      expect(res.statusCode).to.equal(200);
      expect(body.status).to.equal('successful');
      done();
    });
  });

  it('should allow a user to access a public document', (done) => {
    documentObject.method = 'GET';
    documentObject.url = `${docUrl}/${allDocuments[0].id}`;
    userDocument.token = userToken;
    request(documentObject, (req, res, body) => {
      expect(res.statusCode).to.equal(200);
      expect(body.status).to.equal('successful');
      done();
    });
  });

  it(`should allow a user to access rolebased
  documents if they are on the same role`,
  (done) => {
    documentObject.method = 'GET';
    documentObject.url = `${docUrl}/${allDocuments[3].id}`;
    userDocument.token = userToken;
    request(documentObject, (req, res, body) => {
      expect(res.statusCode).to.equal(200);
      expect(body.status).to.equal('successful');
      done();
    });
  });

  it('should allow Admin to find any document', (done) => {
    documentObject.method = 'GET';
    documentObject.url = `${docUrl}/${allDocuments[5].id}`;
    userDocument.token = adminToken;
    request(documentObject, (req, res, body) => {
      expect(res.statusCode).to.equal(200);
      expect(body.status).to.equal('successful');
      done();
    });
  });

  it('should allow SuperAdmin to find any document', (done) => {
    documentObject.method = 'GET';
    documentObject.url = `${docUrl}/${allDocuments[5].id}`;
    userDocument.token = superAdminToken;
    request(documentObject, (req, res, body) => {
      expect(res.statusCode).to.equal(200);
      expect(body.status).to.equal('successful');
      done();
    });
  });

  it(`should deny other users that are not admin or super admin
   from accessing a document they didnt create`, (done) => {
    documentObject.method = 'GET';
    documentObject.url = `${docUrl}/${allDocuments[5].id}`;
    const otherUserObject = {
      url: `${routeUrl}/users`,
      method: 'POST',
      json: {
        userName: 'testjackson',
        password: 'testing1',
        email: 'user1@gmail.com',
        roleId: 4,
        isactive: true,
      },
    };
    request(otherUserObject, (req1, res1, body1) => {
      userDocument.token = body1.token;
      request(documentObject, (req, res, body) => {
        expect(res.statusCode).to.equal(400);
        expect(body.message)
        .to.equal('Access denied!');
        expect(body.status).to.equal('unsuccessful');
        User.findOne({
          where: {
            username: otherUserObject.json.userName,
          }
        }).then((userFound) => {
          if (userFound) {
            userFound.destroy();
          }
          done();
        }).catch(() => {
          done();
        });
      });
    });
  });
});

describe('updating Document', () => {
  const docUrl = `${routeUrl}/documents`;
  const userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
    roleId: 3,
    isactive: true,
  };
  const userDocument = {
    title: 'Why I love team Gimli.',
    body: 'Team gimli shows high spirit and devotion',
    access: 'Private',
  };
  const userDocumentUpdate = {
    title: 'Why I love myself as well',
    body: 'Because I show high spirit and devotion',
    access: 'Private',
  };
  let userToken;
  let adminToken;
  let superAdminToken;
  const userObject = {
    url: `${routeUrl}/users`,
    method: 'POST',
    json: userDetail,
  };
  const adminLogin = {
    url: `${routeUrl}/users/login`,
    method: 'POST',
    json: {
      userName: 'touchstone',
      password: 'testing1',
    }
  };
  const superAdminLogin = {
    url: `${routeUrl}/users/login`,
    method: 'POST',
    json: {
      userName: 'SuperAdmin',
      password: 'testing1',
    }
  };
  const documentObject = {
    url: docUrl,
    method: 'POST',
    json: userDocument,
  };
  let allDocuments;
  before((done) => {
    request(userObject, (req, res, body) => {
      userDocument.userId = body.userId;
      userDocument.token = body.token;
      userDocumentUpdate.userId = body.userId;
      userDocumentUpdate.token = body.token;
      userToken = body.token;
      request(adminLogin, (req, res, body1) => {
        adminToken = body1.token;
        request(superAdminLogin, (req, res, body2) => {
          superAdminToken = body2.token;
          request(documentObject, (req1, res1, body3) => {
            userDocument.docId = body3.documentId;
            const Document = index.Document;
            const newMockDocuments = mockDocuments.map((mockDocument) => {
              mockDocument.userId = body.userId;
              return mockDocument;
            });
            Document.bulkCreate(newMockDocuments)
            .then(() => Document.findAll()).then((documents) => {
              allDocuments = _.map(documents, document => document.dataValues);
              done();
            }).catch(() => {
              done();
            });
          });
        });
      });
    });
  });
  const User = index.User;
  after((done) => {
    User.findOne({
      where: {
        username: userDetail.userName,
      }
    }).then((userFound) => {
      if (userFound) {
        userFound.destroy();
      }
      done();
    }).catch(() => {
      done();
    });
  });
  it('should throw error when trying to update documents that dont exist',
  (done) => {
    documentObject.url = `${docUrl}/dsurehr`;
    documentObject.method = 'PUT';
    documentObject.json = userDocumentUpdate;
    request(documentObject, (req, res, body) => {
      expect(body.status).to.equal('unsuccessful');
      expect(body.message).to.equal('Could not find any document to update!');
      done();
    });
  });

  it(`should deny a random user from editing a document they didn't
  create except for an admin or super admin`,
  (done) => {
    documentObject.url = `${docUrl}/${allDocuments[2].id}`;
    documentObject.method = 'PUT';
    const otherUserObject = {
      url: `${routeUrl}/users`,
      method: 'POST',
      json: {
        userName: 'user',
        password: 'testing1',
        email: 'user1@gmail.com',
        roleId: 4,
        isactive: true,
      },
    };
    request(otherUserObject, (req1, res1, body1) => {
      userDocumentUpdate.token = body1.token;
      documentObject.json = userDocumentUpdate;
      request(documentObject, (req, res, body) => {
        expect(res.statusCode).to.equal(400);
        expect(body.message)
        .to.equal('Restricted document!');
        expect(body.status).to.equal('unsuccessful');
        User.findOne({
          where: {
            username: otherUserObject.json.userName,
          }
        }).then((userFound) => {
          if (userFound) {
            userFound.destroy();
          }
          done();
        }).catch(() => {
          done();
        });
      });
    });
  });

  it('should allow Admin to  edit a document they didnt create', (done) => {
    documentObject.url = `${docUrl}/${allDocuments[2].id}`;
    documentObject.method = 'PUT';
    userDocumentUpdate.token = adminToken;
    documentObject.json = userDocumentUpdate;
    request(documentObject, (req, res, body) => {
      expect(res.statusCode).to.equal(200);
      expect(body.status).to.equal('successful');
      done();
    });
  });

  it('should allow SuperAdmin to  edit a document they didnt create',
  (done) => {
    documentObject.url = `${docUrl}/${allDocuments[2].id}`;
    documentObject.method = 'PUT';
    userDocumentUpdate.token = superAdminToken;
    documentObject.json = userDocumentUpdate;
    request(documentObject, (req, res, body) => {
      expect(res.statusCode).to.equal(200);
      expect(body.status).to.equal('successful');
      done();
    });
  });

  it(`should return an error message when a user trys
  to update a document with an empty form`,
  (done) => {
    documentObject.url = `${docUrl}/${allDocuments[2].id}`;
    documentObject.method = 'PUT';
    userDocumentUpdate.token = userToken;
    userDocumentUpdate.title = '';
    userDocumentUpdate.body = '';
    userDocumentUpdate.access = '';
    documentObject.json = userDocumentUpdate;
    request(documentObject, (req, res, body) => {
      expect(res.statusCode).to.equal(400);
      expect(body.message)
      .to.equal('No new value to update document!');
      expect(body.status).to.equal('unsuccessful');
      done();
    });
  });
});

describe('Deleting a document', () => {
  const userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
    roleId: 3,
    isactive: true,
  };
  const docUrl = `${routeUrl}/documents`;
  let allDocuments;
  const userDocument = {
    title: 'Why I love team Gimli.',
    body: 'Team gimli shows high spirit and devotion',
    access: 'Private',
  };
  let userToken;

  const userObject = {
    url: `${routeUrl}/users`,
    method: 'POST',
    json: userDetail,
  };
  const documentObject = {
    url: docUrl,
    method: 'POST',
    json: userDocument,
  };

  before((done) => {
    request(userObject, (req, res, body) => {
      userDocument.userId = body.userId;
      userDocument.token = body.token;
      userToken = body.token;
      request(documentObject, (req1, res1, body3) => {
        userDocument.docId = body3.documentId;
        const Document = index.Document;
        const newMockDocuments = mockDocuments.map((mockDocument) => {
          mockDocument.userId = body.userId;
          return mockDocument;
        });
        Document.bulkCreate(newMockDocuments)
          .then(() => Document.findAll()).then((documents) => {
            allDocuments = _.map(documents, document => document.dataValues);
            done();
          }).catch(() => {
            done();
          });
      });
    });
  });

  const User = index.User;
  after((done) => {
    User.findOne({
      where: {
        username: userDetail.userName,
      }
    }).then((userFound) => {
      if (userFound) {
        userFound.destroy();
      }
      done();
    }).catch(() => {
      done();
    });
  });
  it('should not allow an unauthenticated user to delete any document',
    (done) => {
      documentObject.url = `${routeUrl}/documents/e2`;
      documentObject.method = 'DELETE';
      documentObject.json.token = '';
      request(documentObject, (req, res, body) => {
        expect(body.status).to.equal('unsuccessful');
        expect(body.message).to.equal('You are not authenticated!');
        done();
      });
    });

  it('should fail to delete document with invalid ID', (done) => {
    documentObject.url = `${routeUrl}/documents/52`;
    documentObject.json = { token: userToken };
    request(documentObject, (req, res, body) => {
      expect(body.status).to.equal('unsuccessful');
      expect(body.message).to.equal('Could not find document!');
      done();
    });
  });

  it('A user should successfully delete a document they created', (done) => {
    documentObject.url = `${routeUrl}/documents/${allDocuments[3].id}`;
    documentObject.json = { token: userToken };
    request(documentObject, (req, res, body) => {
      expect(body.status).to.equal('successful');
      expect(body.message).to.equal('"Test spec document 3" has been deleted!');
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('should not be able to delete another users document', (done) => {
    documentObject.url = `${routeUrl}/documents/${allDocuments[2].id}`;
    documentObject.method = 'DELETE';
    const otherUserObject = {
      url: `${routeUrl}/users`,
      method: 'POST',
      json: {
        userName: 'user',
        password: 'testing1',
        email: 'user1@gmail.com',
        roleId: 4,
        isactive: true,
      },
    };
    request(otherUserObject, (req1, res1, body1) => {
      documentObject.json.token = body1.token;
      request(documentObject, (req, res, body) => {
        expect(res.statusCode).to.equal(400);
        expect(body.status).to.equal('unsuccessful');
        User.findOne({
          where: {
            username: otherUserObject.json.userName,
          }
        }).then((userFound) => {
          if (userFound) {
            userFound.destroy();
          }
          done();
        }).catch(() => {
          done();
        });
      });
    });
  });
});

describe('getUserDocument', () => {
  const userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
    roleId: 3,
    isactive: true,
  };
  const docUrl = `${routeUrl}/documents`;
  let allDocuments;
  const userDocument = {
    title: 'Why I love team Gimli.',
    body: 'Team gimli shows high spirit and devotion',
    access: 'Private',
  };
  const userObject = {
    url: `${routeUrl}/users`,
    method: 'POST',
    json: userDetail,
  };
  const documentObject = {
    url: docUrl,
    method: 'POST',
    json: userDocument,
  };

  before((done) => {
    request(userObject, (req, res, body) => {
      userDocument.userId = body.userId;
      userDocument.token = body.token;
      request(documentObject, (req1, res1, body3) => {
        userDocument.docId = body3.documentId;
        const Document = index.Document;
        const newMockDocuments = mockDocuments.map((mockDocument) => {
          mockDocument.userId = body.userId;
          return mockDocument;
        });
        Document.bulkCreate(newMockDocuments)
          .then(() => Document.findAll()).then((documents) => {
            allDocuments = _.map(documents, document => document.dataValues);
            done();
          }).catch(() => {
            done();
          });
      });
    });
  });

  const User = index.User;
  after((done) => {
    User.findOne({
      where: {
        username: userDetail.userName,
      }
    }).then((userFound) => {
      if (userFound) {
        userFound.destroy();
      }
      done();
    }).catch(() => {
      done();
    });
  });

  it('should get all documents created by a given user',
  (done) => {
    documentObject.url = `${routeUrl}/users/${userDocument.userId}/documents`;
    documentObject.method = 'GET';
    request(documentObject, (req, res, body) => {
      expect(body.status).to.equal('successful');
      expect(body.count).to.equal(allDocuments.length);
      done();
    });
  });

  it('should get documents based on the values of offset and limit given',
  (done) => {
    documentObject.url =
    `${routeUrl}/users/${userDocument.userId}/documents?offset=2&limit2`;
    documentObject.method = 'GET';
    request(documentObject, (req, res, body) => {
      expect(body.documents.length).to.equal(4);
      expect(body.status).to.equal('successful');
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('should notify a user when they have not created any document',
  (done) => {
    documentObject.method = 'GET';
    const otherUserObject = {
      url: `${routeUrl}/users`,
      method: 'POST',
      json: {
        userName: 'user',
        password: 'testing1',
        email: 'user1@gmail.com',
        roleId: 4,
        isactive: true,
      },
    };
    request(otherUserObject, (req1, res1, body1) => {
      documentObject.url = `${routeUrl}/users/${body1.userId}/documents`;
      documentObject.json.token = body1.token;
      request(documentObject, (req, res, body) => {
        expect(res.statusCode).to.equal(400);
        expect(body.message)
          .to.equal('No document found!');
        expect(body.status).to.equal('unsuccessful');
        User.findOne({
          where: {
            username: 'user',
          }
        }).then((userFound) => {
          if (userFound) {
            userFound.destroy();
          }
          done();
        }).catch(() => {
          done();
        });
      });
    });
  });

  it('should deny users access to view documents belonging to other users',
  (done) => {
    documentObject.method = 'GET';
    const otherUserObject = {
      url: `${routeUrl}/users`,
      method: 'POST',
      json: {
        userName: 'user',
        password: 'testing1',
        email: 'user1@gmail.com',
        roleId: 4,
        isactive: true,
      },
    };
    request(otherUserObject, (req1, res1, body1) => {
      documentObject.url =
      `${routeUrl}/users/${userDocument.userId}/documents?offset=2`;
      documentObject.json.token = body1.token;
      request(documentObject, (req, res, body) => {
        expect(res.statusCode).to.equal(400);
        expect(body.message)
          .to.equal('No document found!');
        expect(body.status).to.equal('unsuccessful');
        User.findOne({
          where: {
            username: 'user',
          }
        }).then((userFound) => {
          if (userFound) {
            userFound.destroy();
          }
          done();
        }).catch(() => {
          done();
        });
      });
    });
  });

  it('should deny unauthenticated user access to view all documents',
  (done) => {
    documentObject.url = `${routeUrl}/users/50/documents`;
    documentObject.method = 'GET';
    documentObject.json.token = '';
    request(documentObject, (req, res, body) => {
      expect(res.statusCode).to.equal(400);
      expect(body.status).to.equal('unsuccessful');
      expect(body.message).to.equal('You are not authenticated!');
      done();
    });
  });
});
