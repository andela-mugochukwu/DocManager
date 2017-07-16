import request from 'request';
import index from '../../server/models';
import { generalValidation, validateEmail, validatePassword } from
  '../../server/controller/middlewares/validation';

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

const routeUrl = 'http://localhost:1844/api/v1';
fdescribe('SignUpValidation()', () => {
  const url = `${routeUrl}/users`;
  const userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
  };
  let requestObject = {
    url,
    method: 'POST',
    json: userDetail,
  };
  afterEach((done) => {
    requestObject = {
      url,
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
  it('should throw error when nothing is submitted', (done) => {
    requestObject.json = {};
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('unsuccessful');
      expect(body.message[0]).toBe('Empty fields are not allowed');
      expect(res.statusCode).toBe(400);
      done();
    });
  });

  it('Should move on to the next function when form is properly filled',
    (done) => {
      request(requestObject, (req, res) => {
        expect(res.statusCode).toBe(200);
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

