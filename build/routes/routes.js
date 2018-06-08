'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validation = require('../middlewares/validation');

var _controller = require('../controller');

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Roles = _controller2.default.Roles;
var Users = _controller2.default.Users;
var Documents = _controller2.default.Documents;
/**
 * Creates the document model
 * @param {object} router - represents router object from express to use
 * @param {object} compiler - contains information in the webpack
 * @return {null} returns void
 */
var routes = function routes(router) {
  // route to create a new user
  router.post('/users', _validation.signUpValidation, Users.signUp);
  // route to signin a user
  router.post('/users/login', _validation.signInValidation, Users.signIn);

  router.use(_validation.verifyToken);
  // route to create role
  router.post('/role', _validation.isSuperAdmin, Roles.create);
  // Update a specific role
  router.put('/role/:id', _validation.isSuperAdmin, Roles.edit);
  // Deletes a specific role
  router.delete('/role/:id', _validation.isSuperAdmin, Roles.delete);
  // route to find a specific role
  router.get('/role/:id', _validation.isAdmin, Roles.find);
  // route to get all roles
  router.get('/roles', _validation.isAdmin, Roles.getAll);

  // Update a specific user
  router.put('/users/:id', Users.update);
  // Find a specific user
  router.get('/users/:userId', Users.viewProfile);
  // route to get all users and paginate them
  router.get('/users', _validation.isAdmin, Users.getAll);
  // Deletes a specific user
  router.delete('/users/:id', _validation.isAdmin, Users.delete);
  // route to search for users
  router.get('/search/users', _validation.isAdmin, Users.find);
  // route to fetch documents belonging to a user
  router.get('/users/:id/documents', Documents.getUserDocuments);

  // route to search for documents
  router.get('/search/documents', Documents.search);
  // route to find a specific document
  router.get('/document/:id', Documents.find);
  // route to get access required documents
  router.get('/documents/:access', Documents.getAll);
  // route to get all documents
  router.get('/documents', _validation.isAdmin, Documents.getAll);
  // route to create a new document
  router.post('/documents', Documents.create);
  // route to update a specific document
  router.put('/documents/:id', Documents.update);
  // route to delete a specific document
  router.delete('/documents/:id', Documents.delete);
};

exports.default = routes;