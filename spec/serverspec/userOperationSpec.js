import request from 'request';
import index from '../../server/models';

const routeUrl = 'http://localhost:1844/api/v1';
describe('signUpUser(): ', () => {
  let userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
    roleId: 2,
  };
  let requestObject = {
    url: `${routeUrl}/users`,
    method: 'POST',
    json: userDetail,
  };

  afterEach((done) => {
    requestObject = {
      url: `${routeUrl}/users`,
      method: 'POST',
      json: userDetail,
    };
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
    }).catch();
  });

  beforeEach(() => {
    userDetail = {
      userName: 'jackson',
      email: 'jackson@gmail.com',
      password: 'testing1',
      roleId: 2,
    };
  });

  it(`should Add user info to database when all form fields
  are correctly filled`, (done) => {
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('successful');
      expect(body.userName).toBe('jackson');
      expect(body.userEmail).toBe('jackson@gmail.com');
      expect(body.roleId).toBe(2);
      expect(body.token).not.toBeNull();
      done();
    });
  });

  it('should not create user that already exist', (done) => {
    request(requestObject, () => {
      request(requestObject, (req, res, body) => {
        expect(body.status).toBe('unsuccessful');
        expect(body.message).toBe('User already exist');
        done();
      });
    });
  });

  it('should throw error when invalid form is posted', (done) => {
    requestObject.json = {
      userName: 'jadofd',
      userEmail: '@mail.com'
    };
    request(requestObject, (req, res, body) => {
      expect(body.status).not.toBe('successful');
      done();
    });
  });

  it('should throw error when invalid form is posted', (done) => {
    requestObject.json = {
      userName: 'jackson',
      email: 'jackson@gmail.com',
      password: 'testing1',
    };
    request(requestObject, (req, res, body) => {
      expect(body.status).not.toBe('successful');
      expect(body.message
        .includes('Server error just occured!')).toBe(true);
      done();
    });
  });
});

describe('signInUser()', () => {
  const userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
    roleId: 2,
  };
  let requestObject = {
    url: `${routeUrl}/users`,
    method: 'POST',
    json: userDetail,
  };

  beforeEach((done) => {
    request(requestObject, () => {
      done();
    });
  });

  afterEach((done) => {
    requestObject = {
      url: `${routeUrl}/users`,
      method: 'POST',
      json: userDetail,
    };
    userDetail.userName = 'jackson';
    userDetail.password = 'testing1';
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
    }).catch();
  });

  it(`should return status as successful when
  the user is successfully authenticated`, (done) => {
    requestObject.url = `${routeUrl}/users/login`;
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('successful');
      expect(body.userName).toBe('jackson');
      expect(body.userEmail).toBe('jackson@gmail.com');
      expect(body.roleId).toBe(2);
      done();
    });
  });

  it('should throw error when user dont exist in the database', (done) => {
    requestObject.url = `${routeUrl}/users/login`;
    userDetail.userName = 'james';
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('unsuccessful');
      expect(body.message).toBe('Could not identify you!');
      expect(res.statusCode).toBe(400);
      done();
    });
  });

  it('should throw error when password is invalid', (done) => {
    requestObject.url = `${routeUrl}/users/login`;
    userDetail.password = 'james';
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('unsuccessful');
      expect(body.message).toBe('Wrong username or password!');
      expect(res.statusCode).toBe(400);
      done();
    });
  });

  it('should not get to this function when no password is inputed', (done) => {
    requestObject.url = `${routeUrl}/users/login`;
    userDetail.password = null;
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('unsuccessful');
      expect(body.message).not.toBe('Wrong username or password!');
      expect(res.statusCode).toBe(400);
      done();
    });
  });

  it('should not get to this function when no password is inputed', (done) => {
    requestObject.url = `${routeUrl}/users/login`;
    userDetail.userName = null;
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('unsuccessful');
      expect(body.message).not.toBe('Could not identify you!');
      expect(res.statusCode).toBe(400);
      done();
    });
  });
});
