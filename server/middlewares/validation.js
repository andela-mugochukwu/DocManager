import JwtToken from 'jsonwebtoken';
import index from '../models';

const userModel = index.User;
const Role = index.Roles;
/**
 * Creates a web token for the user
 * @param {object} user - The user object to create token for
 * @return {string} returns the jsonwebtoken created
 */
const createToken = (user) => {
  if (!user) {
    return 'No payload to create token';
  }
  return JwtToken.sign(user,
    process.env.SUPERSECRET);
};

/**
 * Verifies that the submitted token is authentic before granting access
 * to other functionalities
 * @param {object} req - The token to verify
 * @param {object} res - The token to verify
 * @param {object} next - Function used to access the next route
 * @return {null} Returns void
 */
const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token ||
    req.headers.token || '';
  JwtToken.verify(token, process.env.SUPERSECRET, (err, verifiedToken) => {
    if (err) {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'You are not authenticated!',
      });
    } else {
      userModel.findOne({
        where: {
          username: verifiedToken.userName,
          id: verifiedToken.userId
        }
      }).then((user) => {
        if (!user) {
          return res.status(400).send({
            status: 'unsuccessful',
            message: 'No user found!',
          });
        }
        if (!user.isactive) {
          return res.status(400).send({
            status: 'unsuccessful',
            message: 'Inactive user!',
          });
        }
        req.body.user = verifiedToken;
        next();
      }).catch(() => res.status(400).send({
        status: 'unsuccessful',
        message: 'An error occured in the server during authentication!',
      }));
    }
  });
};
/**
 * Allows only the admin to access the next functionality
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} next - Function used to access the next route
 * @return {null} Returns void
 */
const isAdmin = (req, res, next) => {
  const userDetails = req.body.user || {};
  if (userDetails.roleType === 'Admin'
    || userDetails.roleType === 'SuperAdmin') {
    next();
  } else {
    res.status(400).send({
      status: 'unsuccessful',
      message: 'Access denied!'
    });
  }
};
/**
 * Allows only super admin to access the next functionality
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} next - Function used to access the next route
 * @return {null} Returns void
 */
const isSuperAdmin = (req, res, next) => {
  const userDetails = req.body.user || {};
  if (userDetails.roleType === 'SuperAdmin') {
    next();
  } else {
    res.status(400).send({
      status: 'unsuccessful',
      message: 'Access denied!'
    });
  }
};
/**
 * Middleware functionality to check for null or empty form fields
 * @param {string} value - the input value to validate
 * @param {string} formField - the input to validate
 * @return {object} returns an object that contain validation status an
 * error messages if any
 */
const generalValidation = (value, formField) => {
  const user = { status: 'successful', message: [] };
  // check for null and empty fields
  if (value === null || value === '' || typeof value === 'undefined') {
    user.status = 'unsuccessful';
    user.message.push(`\nEmpty or undefined ${formField} field!`);
    return user;
  }
  // check to see if script characters are included
  if (value.includes('<') || value.includes('>')) {
    user.status = 'unsuccessful';
    user.message.push('\nInvalid input character(s)');
  }
  return user;
};

/**
 * Validate the user email input
 * @param {string} inputEmail - The input email to validate
 * @param {string} formField - The input email to validate
 * @return {object} returns an object that contain validation status an
 * error messages if any
 */
const validateEmail = (inputEmail, formField) => {
  const email = generalValidation(inputEmail, formField);
  // check to see if email entered follows the standard format
  if (email.status === 'successful') {
  //  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const foundMatch = inputEmail.match(emailRegex);
    if (!foundMatch) {
      email.status = 'unsuccessful';
      email.message.push('\nEmail has got wrong format');
    }
  }
  return email;
};

/**
 * Validate the user password input
 * @param {string} inputPassword - The input password to validate
 * @param {string} formField - The formfield name to validate
 * @return {object} returns an object that contain validation status an
 * error messages if any
 */
const validatePassword = (inputPassword, formField) => {
  // check if the password is empty or null
  const password = generalValidation(inputPassword, formField);
  if (password.status === 'successful') {
    if (inputPassword.length < 6 || inputPassword.length > 20) {
      password.status = 'unsuccessful';
      password.message.push('\nPassword length must be between 6 and 20');
    }
  }
  return password;
};
/**
 * Middleware functionality to validate user input during signin
 * @param {object} req - The request object from express
 * @param {object} res - The response object from express
 * @param {object} next - The function to move control to next middleware
 * @return {object} returns void
 */
const signInValidation = (req, res, next) => {
  // get the user detail from the request body
  const err = { status: 'successful', message: [] };
  if (Object.keys(req.body).length !== 0 && req.body.constructor === Object) {
    const userNameValidation = generalValidation(req.body.userName, 'username');
    const passwordValidation = validatePassword(req.body.password, 'password');
    if (userNameValidation.status === 'successful' &&
      passwordValidation.status === 'successful') {
      next();
    } else {
      err.status = 'unsuccessful';
      err.message = err.message.concat(...userNameValidation.message,
        ...['\nWrong password']);
      res.status(400).send(err);
    }
  } else {
    err.status = 'unsuccessful';
    err.message.push('\nEmpty forms are not allowed!');
    res.status(400).send(err);
  }
};

/**
 * Middleware functionality to validate user input during signup
 * @param {object} req - The request object from express
 * @param {object} res - The response object from express
 * @param {object} next - The function to move control to next middleware
 * @return {object} returns void
 */
const signUpValidation = (req, res, next) => {
  const err = { status: 'successful', message: [] };
  // get the user detail from the request body and check if they are valid
  if (Object.keys(req.body).length !== 0 && req.body.constructor === Object) {
    const userNameValidation = generalValidation(req.body.userName, 'username');
    const passwordValidation = validatePassword(req.body.password, 'password');
    const emailValidation = validateEmail(req.body.email, 'email');
    if (userNameValidation.status === 'successful' &&
      passwordValidation.status === 'successful' &&
      emailValidation.status === 'successful' &&
      typeof req.body.isactive === 'boolean') {
      Role.count().then((count) => {
        if (req.body.roleId > 2 && req.body.roleId <= count) {
          next();
        } else {
          err.status = 'unsuccessful';
          err.message.push('\nInvalid role!');
          res.status(400).send(err);
        }
      });
    } else {
      err.status = 'unsuccessful';
      err.message = err.message.concat(...userNameValidation.message,
        ...passwordValidation.message,
        ...emailValidation.message);
      if (err.message.length === 0) {
        err.message[0] = 'Set "isactive" property';
      }
      res.status(400).send(err);
    }
  } else {
    err.status = 'unsuccessful';
    err.message.push('\nEmpty fields are not allowed');
    res.status(400).send(err);
  }
};

export {
  signUpValidation, signInValidation, generalValidation, validateEmail,
  validatePassword, createToken, verifyToken, isAdmin,
  isSuperAdmin
};
