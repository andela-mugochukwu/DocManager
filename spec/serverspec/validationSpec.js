import request from 'request';
import index from '../../server/models';
import {
  generalValidation, validateEmail,
  createToken, validatePassword
} from
  '../../server/controller/middlewares/validation';

const routeUrl = 'http://localhost:1844/api/v1';
describe('generalValidation()', () => {
  it('should throw error when script char (<,>) is used', () => {
    const user = generalValidation('<script>alert(\'I Love you\')</script>');
    expect(user.status).toBe('unsuccessful');
    expect(user.message.includes('Invalid input character(s)')).toBe(true);
  });

  it('should pass when no script char (<,>) is used', () => {
    const user = generalValidation('testing1');
    expect(user.status).toBe('successful');
    expect(user.message.includes('Invalid input character(s)')).toBe(false);
  });

  it('should throw error when user field is empty', () => {
    const user = generalValidation('');
    expect(user.status).toBe('unsuccessful');
    expect(user.message.includes('Empty or undefined fields are not allowed'))
      .toBe(true);
  });

  it('should not throw error when user field is correctly filled', () => {
    const user = generalValidation('peace');
    expect(user.status).toBe('successful');
    expect(user.message.length).toBe(0);
  });

  it('Should throw error when null or undefined value is submitted', () => {
    let user = generalValidation(null);
    expect(user.status).toBe('unsuccessful');
    expect(user.message.includes('Empty or undefined fields are not allowed'))
      .toBe(true);
    user = generalValidation(undefined);
    expect(user.status).toBe('unsuccessful');
    expect(user.message.includes('Empty or undefined fields are not allowed'))
      .toBe(true);
  });
});

describe('validateEmail()', () => {
  it('Should accept correct emails', () => {
    let email = validateEmail('kingsleyu13@gmail.com');
    expect(email.status).toBe('successful');
    email = validateEmail('chima.eze.go@lycos.com.ng');
    expect(email.status).toBe('successful');
  });

  it('Should reject incorrect emails', () => {
    let email = validateEmail('kingsleyu13gmail.com');
    expect(email.status).toBe('unsuccessful');
    email = validateEmail('fich@jame@gmail.com');
    expect(email.status).toBe('unsuccessful');
    email = validateEmail('fichame@yahoo.co.uk');
    expect(email.status).toBe('successful');
  });

  it('Should return an error message when email validation fails', () => {
    const email = validateEmail('yuuuuuu.com');
    expect(email.status).toBe('unsuccessful');
    expect(email.message.includes('Email has got wrong format')).toBe(true);
  });

  it('should throw error when empty', () => {
    const email = validateEmail('');
    expect(email.status).toBe('unsuccessful');
  });
});

describe('validatePassword:', () => {
  it('should be at least 6 characters', () => {
    let password = validatePassword('testi');
    expect(password.status).toBe('unsuccessful');
    expect(password.message.includes(
      'Password length must be between 6 and 20')).toBe(true);
    password = validatePassword('testin');
    expect(password.status).toBe('successful');
  });

  it('should be at most 20 characters', () => {
    const password = validatePassword('testikhdhfh68dskksdhflfs9878s9ss');
    expect(password.status).toBe('unsuccessful');
    expect(password.message.includes(
      'Password length must be between 6 and 20')).toBe(true);
  });

  it('should be between 6 and 20 both inclusive characters', () => {
    const password = validatePassword('merrymaking');
    expect(password.status).toBe('successful');
    expect(password.message.includes(
      'Password length must be between 6 and 20')).toBe(false);
  });

  it('should not display error message when no input is found', () => {
    const password = validatePassword('');
    expect(password.status).toBe('unsuccessful');
    expect(password.message.includes(
      'Password length must be between 6 and 20')).not.toBe(true);
  });
});

describe('SignIn and SignUp validation: ', () => {
  let userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
    roleId: 2,
  };
  let requestObject = {
    url: '',
    method: 'POST',
    json: userDetail,
  };

  beforeEach(() => {
    userDetail = {
      userName: 'jackson',
      email: 'jackson@gmail.com',
      password: 'testing1',
      roleId: 2,
    };
  });

  afterEach((done) => {
    requestObject = {
      url: '',
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

  describe('SignInValidation()', () => {
    beforeEach(() => {
      requestObject.url = `${routeUrl}/users/login`;
    });
    it('Should return error message when empty form is sent', (done) => {
      requestObject.json = {};
      request(requestObject, (req, res, body) => {
        expect(body.status).toBe('unsuccessful');
        expect(res.statusCode).toBe(400);
        expect(body.message.includes('Empty forms are not allowed!'))
          .toBe(true);
        done();
      });
    });

    it('Should move to the next function when form submitted is valid',
      (done) => {
        requestObject.url = `${routeUrl}/users`;
        request(requestObject, () => {
          requestObject.url = `${routeUrl}/users/login`;
          request(requestObject, (req, res, body) => {
            expect(body.status).toBe('successful');
            done();
          });
        });
      });

    it('Should throw correct error message when password has a wrong format',
      (done) => {
        requestObject.json.password = '';
        request(requestObject, (req, res, body) => {
          expect(body.status).toBe('unsuccessful');
          expect(res.statusCode).toBe(400);
          expect(body.message
            .includes('Empty or undefined fields are not allowed'))
            .toBe(true);
          done();
        });
      });

    it('Should throw correct error message when username has a wrong format',
      (done) => {
        requestObject.json.userName = '';
        request(requestObject, (req, res, body) => {
          expect(body.status).toBe('unsuccessful');
          expect(res.statusCode).toBe(400);
          expect(body.message
            .includes('Empty or undefined fields are not allowed'))
            .toBe(true);
          done();
        });
      });
  });

  describe('SignUpValidation()', () => {
    // function to run before all tests
    beforeEach(() => {
      requestObject.url = `${routeUrl}/users`;
      requestObject.json = userDetail;
    });

    it('should throw error when nothing is submitted', (done) => {
      requestObject.json = {};
      request(requestObject, (req, res, body) => {
        expect(body.status).toBe('unsuccessful');
        expect(body.message[0]).toBe('Empty fields are not allowed');
        expect(res.statusCode).toBe(400);
        done();
      });
    });

    it('Should move on to the next function when form is valid',
      (done) => {
        request(requestObject, (req, res, body) => {
          expect(body.status).not.toBe('unsuccessful');
          done();
        });
      });

    it('Should return an error message when username is not filled',
      (done) => {
        requestObject.json.userName = '';
        request(requestObject, (req, res, body) => {
          expect(res.statusCode).toBe(400);
          expect(body.status).toBe('unsuccessful');
          expect(body.message
            .includes('Empty or undefined fields are not allowed')
          ).toBe(true);
          done();
        });
      });
  });
});

describe('createToken()', () => {
  it('should return a token as string when called', () => {
    const user = {
      userName: 'jackson',
      email: 'jackson@gmail.com',
      roleId: '1',
    };
    expect(typeof createToken(user)).toBe('string');
  });
});

describe('verifyToken', () => {
  const url = `${routeUrl}/users/141`;
  const requestObject = {
    url,
    method: 'PUT',
    json: {
      token: 'fjshdoeslhfske7383.sljshjfdfeoekso.8887hkjklfksjse',
    }
  };
  it('should not authenticate the request when invalid token is used',
    (done) => {
      request(requestObject, (req, res, body) => {
        expect(res.statusCode).toBe(400);
        expect(body.message).toBe('You are not authenticated!');
        expect(body.status).toBe('unsuccessful');
        done();
      });
    });

  it(`should not authenticate request when 
  fake user info is embedded in token`, (done) => {
    const token = createToken({
      userName: 'james',
      password: 'testing1',
      email: 'jamaes@yahoo.com',
    });
    requestObject.json.token = token;
    request(requestObject, (req, res, body) => {
      expect(body.message).toBe('Invalid user- you are not authenticated!');
      expect(res.statusCode).toBe(400);
      expect(body.status).toBe('unsuccessful');
      done();
    });
  });

  it('should move to next function when user detail is correct', (done) => {
    const token = createToken({
      userName: 'james008',
      password: 'testing1',
      email: 'jamaes008@gmail.com',
    });
    requestObject.json.token = token;
    request(requestObject, (req, res, body) => {
      expect(body.message.includes('You are not authenticated!'))
        .toBe(false);
      expect(body.message.includes('Invalid user- you are not authenticated!'))
        .toBe(false);
      done();
    });
  });
});

describe('allowOnlyAdmin()', () => {
  const token = createToken({
    userName: 'touchstone',
    password: 'testing1',
    email: 'touchstone@gmail.com',
    roleId: 3,
  });
  const url = `${routeUrl}/users/141`;
  const requestObject = {
    url,
    method: 'GET',
    json: {
      token,
    }
  };

  afterEach(() => {
    requestObject.json.token = token;
  });

  it('should allow only the admin as touchstone to access the next function',
    (done) => {
      request(requestObject, (req, res, body) => {
        expect(body.status).not.toBe('unsuccessful');
        done();
      });
    });

  it('should deny access to other admin aside touchstone', (done) => {
    requestObject.json.token = createToken({
      userName: 'james013',
      password: 'testing1',
      email: 'james013@gmail.com',
      roleId: 3,
    });
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('unsuccessful');
      expect(body.message.includes('Access denied!'))
        .toBe(true);
      done();
    });
  });

  it('should throw error when no role information is given', (done) => {
    requestObject.json.token = createToken({
      userName: 'james013',
      password: 'testing1',
      email: 'james013@gmail.com',
    });
    request(requestObject, (req, res, body) => {
      expect(body.message).toBe('Access denied!');
      expect(body.status).toBe('unsuccessful');
      done();
    });
  });
});
