'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _pagination = require('../helpers/pagination');

var _pagination2 = _interopRequireDefault(_pagination);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Role = _models2.default.Roles;

module.exports = {
  /**
  * Create a role
  * @param {object} req - The request object from the server
  * @param {object} res - The response object from the server
  * @return {null} returns void
  */
  create: function create(req, res) {
    var roletype = { roletype: req.body.roletype };
    Role.findOrCreate({
      where: _extends({}, roletype),
      defaults: {
        roletype: roletype.roletype
      }
    }).spread(function (roleCreated, isCreated) {
      if (isCreated) {
        res.send({
          status: 'successful',
          role: roleCreated
        });
      } else {
        res.send({
          status: 'unsuccessful',
          message: roletype.roletype + ' Role already exist!'
        });
      }
    }).catch(function () {
      res.send({
        status: 'unsuccessful',
        message: 'Could not create ' + roletype.roletype + ' role!'
      });
    });
  },


  /**
   * Deletes a given role
   * @param {object} req - The request object from the server
  * @param {object} res - The response object from the server
   * @return {null} returns void
   */
  delete: function _delete(req, res) {
    var roleId = Number(req.params.id);
    var response = {};
    response.status = 'unsuccessful';
    Role.findById(roleId).then(function (foundRole) {
      if (foundRole) {
        foundRole.destroy().then(function () {
          response.status = 'successful';
          response.message = '"' + foundRole.roletype + '" has been deleted!';
          return res.status(200).send(response);
        }).catch(function () {
          response.status = 'unsuccessful';
          response.message = 'Could not delete the role!';
          return res.status(400).send(response);
        });
      } else {
        response.status = 'unsuccessful';
        response.message = 'Could not find role!';
        return res.status(400).send(response);
      }
    }).catch(function () {
      response.status = 'unsuccessful';
      response.message = 'Wrong or invalid role ID!';
      return res.status(400).send(response);
    });
  },


  /**
   * Edit user roles
   * @param {object} req - The request object from the server
   * @param {object} res - The response object from the server
   * @return {null} returns void
   */
  edit: function edit(req, res) {
    var response = {};
    response.status = 'unsuccessful';
    var newRoleValue = { roletype: req.body.roletype };
    var roleId = Number(req.params.id);
    Role.findById(roleId).then(function (foundRole) {
      if (!foundRole) {
        response.message = 'Could not update your role';
        return res.status(400).send(response);
      }
      Role.update(_extends({}, newRoleValue)).then(function () {
        response.status = 'successful';
        return res.status(200).send(response);
      }).catch(function () {
        response.message = 'Could not update your role';
        return res.status(400).send(response);
      });
    }).catch(function () {
      response.message = 'An error occurred while editing your role';
      return res.status(400).send(response);
    });
  },


  /**
   * Finds a particular role
   * @param {object} req - The request object from the server
   * @param {object} res - The response object from the server
   * @return {null} returns void
   */
  find: function find(req, res) {
    var roleId = Number(req.params.id);
    if (Number.isInteger(roleId) && roleId > 0) {
      Role.findById(roleId).then(function (foundRole) {
        if (foundRole) {
          res.status(200).send({
            status: 'successful',
            foundRole: foundRole
          });
        } else {
          res.status(400).send({
            status: 'unsuccessful',
            message: 'Could not find any role!'
          });
        }
      });
    } else {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Invalid search parameter!'
      });
    }
  },


  /**
   * Get all roles
   * @param {object} req - The request object from the server
   * @param {object} res - The response object from the server
   * @return {null} returns void
   */
  getAll: function getAll(req, res) {
    var response = {};
    response.status = 'unsuccessful';
    // check it limit and offset where passed
    var params = { offset: req.query.offset || 0,
      limit: req.query.limit || 8 };
    Role.findAndCountAll(_extends({
      attributes: ['id', 'roletype', 'updatedAt']
    }, params)).then(function (roles) {
      if (roles.count > 0) {
        response.status = 'successful';
        response.count = roles.count;
        response.roles = roles.rows;
        response.paginationMetaData = (0, _pagination2.default)(roles, params);
        res.status(200).send(response);
      } else {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'No role found!'
        });
      }
    }).catch(function () {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'An error occurred!'
      });
    });
  }
};