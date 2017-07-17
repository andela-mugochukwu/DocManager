import request from 'request';
import index from '../../server/models';

const routeUrl = 'http://localhost:1844/api/v1';
fdescribe('getUserDocuments()', () => {
  const userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
    roleId: 2,
  };
  const document = {
    title: 'This is just a test',
    body: 'I really want to take a timeout to test my functions.',
    access: 2,
    userId: 0,
  };
  let requestObject = {
    url: `${routeUrl}/users`,
    method: 'POST',
    json: userDetail,
  };

  beforeEach((done) => {
    // create a user first
    request(requestObject, (req, res, body) => {
      document.userId = body.userId;
      document.token = body.token;
      requestObject.json = document;
      requestObject.url = `${routeUrl}/documents`;
      request(requestObject, () => {
        done();
      });
    });
  });

  afterEach((done) => {
    requestObject = {
      url: `${routeUrl}/users`,
      method: 'POST',
      json: userDetail,
    };
    const user = index.User;
    user.findById(document.userId).then((foundUser) => {
      if (foundUser) {
        foundUser.destroy();
      }
      document.userId = 0;
      document.token = '';
      requestObject.json = {};
      console.log('.............///////', requestObject);
      done();
    }).catch();
  });

  it('should successfully get user document that exist', (done) => {
    requestObject.url = `${routeUrl}/${document.userId}/documents`;
    requestObject.method = 'GET';
    request(requestObject, (req, res, body) => {
      expect(res.statusCode).toBe(200);
      expect(body.status).toBe('successful');
      done();
    });
  });
});
