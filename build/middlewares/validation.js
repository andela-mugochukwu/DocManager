'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSuperAdmin = exports.isAdmin = exports.verifyToken = exports.createToken = exports.validatePassword = exports.validateEmail = exports.generalValidation = exports.signInValidation = exports.signUpValidation = undefined;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var userModel = _models2.default.User;
var Role = _models2.default.Roles;
/**
 * Creates a web token for the user
 * @param {object} user - The user object to create token for
 * @return {string} returns the jsonwebtoken created
 */
var createToken = function createToken(user) {
  if (!user) {
    return 'No payload to create token';
  }
  return _jsonwebtoken2.default.sign(user, process.env.SUPERSECRET);
};

/**
 * Verifies that the submitted token is authentic before granting access
 * to other functionalities
 * @param {object} req - The token to verify
 * @param {object} res - The token to verify
 * @param {object} next - Function used to access the next route
 * @return {null} Returns void
 */
var verifyToken = function verifyToken(req, res, next) {
  var token = req.body.token || req.query.token || req.headers.token || '';
  _jsonwebtoken2.default.verify(token, process.env.SUPERSECRET, function (err, verifiedToken) {
    if (err) {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'You are not authenticated!'
      });
    } else {
      userModel.findOne({
        where: {
          username: verifiedToken.userName,
          id: verifiedToken.userId
        }
      }).then(function (user) {
        if (!user) {
          return res.status(400).send({
            status: 'unsuccessful',
            message: 'No user found!'
          });
        }
        if (!user.isactive) {
          return res.status(400).send({
            status: 'unsuccessful',
            message: 'Inactive user!'
          });
        }
        req.body.user = verifiedToken;
        next();
      }).catch(function () {
        return res.status(400).send({
          status: 'unsuccessful',
          message: 'An error occured in the server during authentication!'
        });
      });
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
var isAdmin = function isAdmin(req, res, next) {
  var userDetails = req.body.user || {};
  if (userDetails.roleType === 'Admin' || userDetails.roleType === 'SuperAdmin') {
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
var isSuperAdmin = function isSuperAdmin(req, res, next) {
  var userDetails = req.body.user || {};
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
var generalValidation = function generalValidation(value, formField) {
  var user = { status: 'successful', message: [] };
  // check for null and empty fields
  if (value === null || value === '' || typeof value === 'undefined') {
    user.status = 'unsuccessful';
    user.message.push('\nEmpty or invalid ' + formField + ' field!');
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
var validateEmail = function validateEmail(inputEmail, formField) {
  var email = generalValidation(inputEmail, formField);
  // check to see if email entered follows the standard format
  if (email.status === 'successful') {
    //  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g
    var emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    var foundMatch = inputEmail.match(emailRegex);
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
var validatePassword = function validatePassword(inputPassword, formField) {
  // check if the password is empty or null
  var password = generalValidation(inputPassword, formField);
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
var signInValidation = function signInValidation(req, res, next) {
  // get the user detail from the request body
  var err = { status: 'successful', message: [] };
  if (Object.keys(req.body).length !== 0 && req.body.constructor === Object) {
    var userNameValidation = generalValidation(req.body.userName, 'username');
    var passwordValidation = validatePassword(req.body.password, 'password');
    if (userNameValidation.status === 'successful' && passwordValidation.status === 'successful') {
      next();
    } else {
      var _err$message;

      err.status = 'unsuccessful';
      err.message = (_err$message = err.message).concat.apply(_err$message, _toConsumableArray(userNameValidation.message).concat(['\nWrong password']));
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
var signUpValidation = function signUpValidation(req, res, next) {
  var err = { status: 'successful', message: [] };
  // get the user detail from the request body and check if they are valid
  if (Object.keys(req.body).length !== 0 && req.body.constructor === Object) {
    var userNameValidation = generalValidation(req.body.userName, 'username');
    var passwordValidation = validatePassword(req.body.password, 'password');
    var emailValidation = validateEmail(req.body.email, 'email');
    if (userNameValidation.status === 'successful' && passwordValidation.status === 'successful' && emailValidation.status === 'successful' && typeof req.body.isactive === 'boolean') {
      Role.count().then(function (count) {
        if (req.body.roleId > 2 && req.body.roleId <= count) {
          next();
        } else {
          err.status = 'unsuccessful';
          err.message.push('\nInvalid role!');
          res.status(400).send(err);
        }
      });
    } else {
      var _err$message2;

      err.status = 'unsuccessful';
      err.message = (_err$message2 = err.message).concat.apply(_err$message2, _toConsumableArray(userNameValidation.message).concat(_toConsumableArray(passwordValidation.message), _toConsumableArray(emailValidation.message)));
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

exports.signUpValidation = signUpValidation;
exports.signInValidation = signInValidation;
exports.generalValidation = generalValidation;
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.createToken = createToken;
exports.verifyToken = verifyToken;
exports.isAdmin = isAdmin;
exports.isSuperAdmin = isSuperAdmin;