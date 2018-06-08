'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _pagination = require('../helpers/pagination');

var _pagination2 = _interopRequireDefault(_pagination);

var _validation = require('../middlewares/validation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = _models2.default.User;
var Role = _models2.default.Roles;

module.exports = {
  /**
   * Signs up new users to access the application
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @return {null} Returns void
   */
  signUp: function signUp(req, res) {
    // find or create the user if they don't already exist in the
    // database
    User.findOrCreate({
      where: {
        username: req.body.userName
      },
      defaults: {
        username: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        roleId: req.body.roleId,
        isactive: req.body.isactive
      }
    }).spread(function (createdUser, isCreated) {
      // send successful as response when the user is created
      if (isCreated) {
        Role.findById(createdUser.roleId).then(function (userRole) {
          if (userRole) {
            var userDetail = {
              userName: createdUser.username,
              userId: createdUser.id,
              email: createdUser.email,
              isactive: createdUser.isactive,
              roleType: userRole.roletype,
              createdAt: createdUser.createdAt
            };
            var token = (0, _validation.createToken)(userDetail);
            res.status(200).send(_extends({
              status: 'successful'
            }, userDetail, {
              token: token
            }));
          }
        }).catch();
      } else {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'User already exist'
        });
      }
    }).catch(function () {
      res.status(500).send({
        status: 'unsuccessful',
        message: 'Server error just occured!'
      });
    });
  },


  /**
   * Authenticates a user
   * @param {object} req - The request object from express server
   * @param {object} res - The response object from express server
   * @return {null} Returns null
   */
  signIn: function signIn(req, res) {
    var _this = this;

    var errorMessage = '';
    var userException = function userException(message) {
      errorMessage = message;
      _this.name = 'userException';
    };
    var userInfo = req.body;
    User.find({
      where: {
        username: userInfo.userName
      }
    }).then(function (existingUser) {
      var userPassword = existingUser.password;
      if (!existingUser.isactive) {
        throw new userException('user is inactive');
      }
      _bcryptNodejs2.default.compare(userInfo.password, userPassword, function (err, isValid) {
        // check if the password is correct then create a token
        if (isValid) {
          Role.findById(existingUser.roleId).then(function (userRole) {
            if (userRole) {
              var userDetail = {
                userName: existingUser.username,
                userId: existingUser.id,
                email: existingUser.email,
                isactive: existingUser.isactive,
                roleType: userRole.roletype,
                createdAt: existingUser.createdAt
              };
              var token = (0, _validation.createToken)(userDetail);
              res.status(200).send(_extends({
                status: 'successful'
              }, userDetail, {
                token: token
              }));
            }
          }).catch();
        } else {
          res.status(400).send({
            status: 'unsuccessful',
            message: ['Wrong password!']
          });
        }
      });
    }).catch(function () {
      res.status(400).send({
        status: 'unsuccessful',
        message: errorMessage !== '' ? errorMessage : ['Wrong username!']
      });
    });
  },


  /**
   * View specific user profile
  * @param {object} req - The request object from express server
  * @param {object} res - The response object from express server
  * @return {null} Returns null
  */
  viewProfile: function viewProfile(req, res) {
    var id = Number(req.params.userId);
    User.findById(id).then(function (userDetail) {
      if (userDetail && req.body.user.userId === id && userDetail.isactive) {
        res.status(200).send({
          status: 'successful',
          userName: userDetail.username,
          userEmail: userDetail.email,
          userRole: req.body.user.roleType
        });
      } else {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'You cannot view another user\'s detail'
        });
      }
    }).catch(function () {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Error due to invalid user!'
      });
    });
  },


  /**
   * Fetches all users
   * @param {object} req - The request object from express server
   * @param {object} res - The response object from express server
   * @return {null} Returns null
   */
  getAll: function getAll(req, res) {
    // check it limit and offset where passed
    var params = { offset: Number(req.query.offset) || 0,
      limit: Number(req.query.limit) || 8 };
    User.findAndCountAll(_extends({
      attributes: ['id', 'username', 'email', 'roleId', 'isactive', 'createdAt']
    }, params)).then(function (users) {
      res.status(200).send({
        status: 'successful',
        count: users.count,
        users: users.rows,
        paginationMetaData: (0, _pagination2.default)(users, params)
      });
    }).catch(function () {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Could not fetch all users!'
      });
    });
  },


  /**
   * Finds users by username
   * @param {object} req - The request object from express server
   * @param {object} res - The response object from express server
   * @return {null} Returns null
   */
  find: function find(req, res) {
    var params = { offset: req.query.offset || 0,
      limit: req.query.limit || 8 };
    if (!req.query.q) {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'No username to search for!'
      });
    } else {
      User.findAndCountAll(_extends({
        where: {
          username: {
            $iLike: '%' + req.query.q + '%'
          }
        },
        attributes: ['id', 'username', 'email', 'roleId', 'isactive', 'createdAt']
      }, params)).then(function (users) {
        res.status(200).send({
          status: 'successful',
          count: users.count,
          users: users.rows,
          paginationMetaData: (0, _pagination2.default)(users, params)
        });
      }).catch(function () {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'Unable to get user(s)'
        });
      });
    }
  },


  /**
   * Updates a specific user
   * @param {object} req - The request object from express server
   * @param {object} res - The response object from express server
   * @return {null} Returns null
   */
  update: function update(req, res) {
    var userId = Number(req.params.id);
    var userDetail = {};
    if (req.body.email && (0, _validation.validateEmail)(req.body.email, 'email').status === 'successful') {
      userDetail.email = req.body.email;
    }
    if (typeof req.body.isactive !== 'undefined' && req.body.user.roleType === 'Admin') {
      userDetail.isactive = req.body.isactive;
    }
    if (typeof req.body.isactive !== 'undefined' && req.body.user.roleType === 'SuperAdmin') {
      userDetail.isactive = req.body.isactive;
    }
    if (req.body.password && (0, _validation.validatePassword)(req.body.password, 'password').status === 'successful') {
      User.findById(req.body.user.userId).then(function (foundUser) {
        if (foundUser) {
          _bcryptNodejs2.default.compare(req.body.oldPassword, foundUser.password, function (err, response) {
            if (response) {
              userDetail.password = req.body.password;
            }
            if (userId === req.body.user.userId || req.body.user.roleType === 'SuperAdmin' || req.body.user.roleType === 'Admin') {
              User.update(userDetail, {
                individualHooks: true,
                where: {
                  id: userId
                }
              }).then(function () {
                if (Object.keys(userDetail).length !== 0) {
                  res.status(200).send({
                    status: 'successful'
                  });
                } else {
                  res.status(400).send({
                    status: 'unsuccessful',
                    message: 'update failed!'
                  });
                }
              }).catch(function () {
                res.status(400).send({
                  status: 'unsuccessful',
                  message: 'Could not find any user to update!'
                });
              });
            } else {
              res.status(400).send({
                status: 'unsuccessful',
                message: 'No user found!'
              });
            }
          });
        } else {
          res.status(400).send({
            status: 'unsuccessful',
            message: 'No user found!'
          });
        }
      });
    } else if (userId === req.body.user.userId || req.body.user.roleType === 'SuperAdmin' || req.body.user.roleType === 'Admin') {
      Role.count().then(function (count) {
        if (req.body.roleId && req.body.roleId > 0 && req.body.roleId <= count && req.body.user.roleType === 'SuperAdmin') {
          userDetail.roleId = req.body.roleId;
        }
        User.update(userDetail, {
          where: {
            id: userId
          }
        }).then(function () {
          if (Object.keys(userDetail).length !== 0) {
            res.status(200).send({
              status: 'successful'
            });
          } else {
            res.status(400).send({
              status: 'unsuccessful',
              message: 'update failed!'
            });
          }
        }).catch(function () {
          res.status(400).send({
            status: 'unsuccessful',
            message: 'Could not find any user to update!'
          });
        });
      }).catch(function () {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'Could not count roles!'
        });
      });
    } else {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'No user found!'
      });
    }
  },


  /**
   * Delete a specific user
   * @param {object} req - The request object from express server
   * @param {object} res - The response object from express server
   * @return {null} Returns null
   */
  delete: function _delete(req, res) {
    var userId = req.params.id;
    User.findById(userId).then(function (knownUser) {
      if (!knownUser) {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'Could not find any user!'
        });
      } else {
        var statusUpdate = false;
        if (!knownUser.isactive) {
          statusUpdate = true;
        }
        User.update({ isactive: statusUpdate }, {
          where: {
            id: userId
          }
        }).then(function () {
          res.status(200).send({
            status: 'successful',
            message: knownUser.username + ' has been successfully\n            ' + (statusUpdate ? 'activated!' : 'deactivated')
          });
        }).catch();
      }
    }).catch(function () {
      res.status(500).send({
        status: 'unsuccessful',
        message: 'Invalid user ID!'
      });
    });
  }
};