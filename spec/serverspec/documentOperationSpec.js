import request from 'request';
import index from '../../server/models';

const routeUrl = 'http://localhost:1844/api/v1';
const docUrl = `${routeUrl}/documents`;
const userUrl = `${routeUrl}/users`;
const delUserUrl = `${routeUrl}/users`;
let token = '';
const userDetail = {
  userName: 'jackson',
  email: 'jackson@gmail.com',
  password: 'testing1',
  roleId: 2,
  userId: 0,
};

const userDocument = {
  title: 'Why I love team Gimli.',
  body: 'Team gimli shows high spirit and devotion',
  access: 'public',
  userId: userDetail.userId,
};
const createUserObj = {
  url: userUrl,
  method: 'POST',
  json: userDetail,
};

const createDocumentObj = {
  url: docUrl,
  method: 'POST',
  json: userDocument,
};

fdescribe('createDocument()', () => {
  // beforeEach((done) => {
  //   createUserObj.url = userUrl;
  //   request(createUserObj, (req, res, body) => {
  //     token = body.token;
  //     userDetail.userId = body.userId;
  //     done();
  //   });
  // });

  // afterEach((done) => {
  //   createUserObj.url = 
  //   request(createUserObj, (req, res, body) => {
  //     token = body.token;
  //     userDetail.userId = body.userId;
  //     done();
  //   });
  // });

  it('should not create document when user is not authenticated', (done) => {
    request(createDocumentObj, (req, res, body) => {
      expect(body.status).not.toBe('successful');
      expect(body.message).toBe('You are not authenticated!');
      done();
    });
  });
});

// describe('getUserDocuments()', () => {
//   const document = {
//     title: 'This is just a test',
//     body: 'I really want to take a timeout to test my functions.',
//     access: 2,
//     userId: 0,
//   };
//   requestObject.url = `${routeUrl}/users`;
//   requestObject.method = 'POST';
//   requestObject.json = userDetail;

//   beforeEach((done) => {
//     // create a user first
//     request(requestObject, (req, res, body) => {
//       document.userId = body.userId;
//       document.token = body.token;
//       requestObject.json = document;
//       requestObject.url = `${routeUrl}/documents`;
//       request(requestObject, () => {
//         done();
//       });
//     });
//   });

//   afterEach((done) => {
//     requestObject.url = `${routeUrl}/users`;
//     requestObject.method = 'POST';
//     requestObject.json = userDetail;
//     const user = index.User;
//     user.findById(document.userId).then((foundUser) => {
//       if (foundUser) {
//         foundUser.destroy();
//       }
//       document.userId = 0;
//       document.token = '';
//       requestObject.json = {};
//       done();
//     }).catch();
//   });

//   it('should successfully get user document that exist', (done) => {
//     requestObject.url = `${routeUrl}/${document.userId}/documents`;
//     requestObject.method = 'GET';
//     request(requestObject, (req, res, body) => {
//       expect(res.statusCode).toBe(200);
//       expect(body.status).toBe('successful');
//       done();
//     });
//   });
// });
