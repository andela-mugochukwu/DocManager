'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _pagination = require('../helpers/pagination');

var _pagination2 = _interopRequireDefault(_pagination);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Document = _models2.default.Document;
var User = _models2.default.User;
module.exports = {
  /**
  * function to create a document
  * @param {object} req - an object that contains the request body
  * @param {object} res - an object that contains the response body
  * @return {boolean} it returns true if the document was created
  * and false otherwise
  */
  create: function create(req, res) {
    var title = req.body.title || '';
    var body = req.body.body || '';
    var userId = req.body.user.userId;
    var access = req.body.access || '';
    // Don't create document if fields are empty
    if (title === '' || body === '' || access === '') {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Empty title or body or access field!'
      });
    } else {
      // check to see if document with same title exist before creation
      Document.findOrCreate({
        where: { title: title },
        defaults: {
          body: body,
          access: access,
          userId: userId
        }
      }).spread(function (docCreated, isCreated) {
        if (isCreated) {
          res.status(200).send({
            status: 'successful',
            documentId: docCreated.id
          });
        } else {
          res.status(400).send({
            status: 'unsuccessful',
            message: 'Document already exist!'
          });
        }
      }).catch(function () {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'Could not create your document!'
        });
      });
    }
  },


  /**
  * function to fetch all documents from the database
  * @param {object} req - an object that contains the request body
  * @param {object} res - an object that contains the response body
  * @return {null} it returns no value
  */
  getUserDocuments: function getUserDocuments(req, res) {
    var params = { offset: req.query.offset || 0,
      limit: req.query.limit || 8 };
    Document.findAndCountAll(_extends({
      where: { userId: req.body.user.userId },
      attributes: ['id', 'title', 'body', 'userId', 'access', 'createdAt']
    }, params)).then(function (documents) {
      if (documents.count > 0 && Number(req.params.id) === req.body.user.userId) {
        res.status(200).send({
          status: 'successful',
          count: documents.count,
          documents: documents.rows,
          paginationMetaData: (0, _pagination2.default)(documents, params)
        });
      } else {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'No document found!'
        });
      }
    }).catch(function () {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Invalid user ID!'
      });
    });
  },


  /**
  * function to fetch all documents belonging accessible
  *  to a user from the database
  * @param {object} req - an object that contains the request body
  * @param {object} res - an object that contains the response body
  * @return {null} it returns no value
  */
  getAll: function getAll(req, res) {
    var access = req.params.access;
    var params = { offset: req.query.offset || 0,
      limit: req.query.limit || 8 };
    var searchQuery = {};
    switch (access) {
      case 'Public':
        searchQuery = { access: access };
        break;
      case 'Amin':
      case 'SuperAdmin':
      case 'Learning':
      case 'Devops':
      case 'Fellow':
        if (req.body.user.roleType === access) {
          searchQuery = { access: access };
        } else {
          searchQuery = null;
        }
        break;
      case 'All':
        searchQuery = {
          $or: [{ userId: req.body.user.userId }, { access: req.body.user.roleType }, { access: 'Public' }]
        };
        break;
      default:
        if (req.body.user.roleType === 'Admin' || req.body.user.roleType === 'SuperAdmin') {
          searchQuery = {};
        } else {
          searchQuery = null;
        }
        break;
    }
    if (searchQuery) {
      Document.findAndCountAll(_extends({
        where: _extends({}, searchQuery),
        attributes: ['id', 'title', 'body', 'userId', 'access', 'createdAt']
      }, params)).then(function (foundDocuments) {
        var response = {};
        response.status = 'unsuccessful';
        response.message = 'No document found!';
        res.status(400);
        if (foundDocuments.count > 0) {
          response.status = 'successful';
          response.message = '';
          response.count = foundDocuments.count;
          response.documents = foundDocuments.rows;
          response.paginationMetaData = (0, _pagination2.default)(foundDocuments, params);
          res.status(200);
        }
        res.send(response);
      }).catch(function () {
        res.status(500).send({
          status: 'unsuccessful',
          message: 'An error occured while fetching documents!'
        });
      });
    } else {
      return res.status(400).send({
        status: 'unsuccessful',
        message: 'Access denied!'
      });
    }
  },


  /**
  * function to fetch a specific document from the database
  * @param {object} req - an object that contains the request body
  * @param {object} res - an object that contains the response body
  * @return {null} it returns no value
  */
  find: function find(req, res) {
    var documentId = Number(req.params.id);
    if (Number.isInteger(documentId) && documentId > 0) {
      Document.findOne({
        where: { id: documentId }
      }).then(function (foundDocument) {
        User.findById(foundDocument.userId).then(function (documentOwner) {
          foundDocument.dataValues.author = documentOwner.username;
          if (foundDocument) {
            var doc = {};
            switch (foundDocument.access) {
              case 'Private':
                if (foundDocument.userId === req.body.user.userId || req.body.user.roleType === 'Admin' || req.body.user.roleType === 'SuperAdmin') {
                  doc = foundDocument;
                }
                break;
              case 'Public':
                doc = req.body.user.userId ? foundDocument : {};
                break;
              case req.body.user.roleType:
                if (foundDocument.access === req.body.user.roleType) {
                  doc = foundDocument;
                }
                break;
              default:
                if (req.body.user.roleType === 'Admin' || req.body.user.roleType === 'SuperAdmin') {
                  doc = foundDocument;
                } else {
                  return res.status(400).send({
                    status: 'unsuccessful',
                    message: 'Access denied!'
                  });
                }
            }
            res.status(200).send({
              status: 'successful',
              document: doc
            });
          } else {
            res.status(400).send({
              status: 'unsuccessful',
              message: 'Could not find any document!'
            });
          }
        });
      }).catch(function (err) {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'An error coccured while loading your document!',
          err: err
        });
      });
    } else {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Invalid search parameter!'
      });
    }
  },


  /**
  * Update a particular document
  * @param {object} req - The request object from express server
  * @param {object} res - The response object from express server
  * @return {null} Returns null
  */
  update: function update(req, res) {
    var documentId = Number(req.params.id);
    var userDocument = {};
    if (req.body.title) {
      userDocument.title = req.body.title;
    }
    if (req.body.body) {
      userDocument.body = req.body.body;
    }
    if (req.body.access) {
      userDocument.access = req.body.access;
    }
    Document.findById(documentId).then(function (foundDocument) {
      if (foundDocument.userId === req.body.user.userId || req.body.user.roleType === 'Admin' || req.body.user.roleType === 'SuperAdmin') {
        Document.update(userDocument, {
          where: {
            id: documentId
          }
        }).then(function () {
          if (Object.keys(userDocument).length !== 0) {
            res.status(200).send({
              status: 'successful'
            });
          } else {
            res.status(400).send({
              status: 'unsuccessful',
              message: 'No new value to update document!'
            });
          }
        }).catch(function () {
          res.status(400).send({
            status: 'unsuccessful',
            message: 'Could not find any document to update!'
          });
        });
      } else {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'Restricted document!'
        });
      }
    }).catch(function () {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Could not find any document to update!'
      });
    });
  },


  /**
  * Searches through documents for a given title
  * @param {object} req - The request object from express server
  * @param {object} res - The response object from express server
  * @return {null} Returns null
  */
  search: function search(req, res) {
    var params = { offset: req.query.offset || 0,
      limit: req.query.limit || 8 };
    if (!req.query.q) {
      return res.status(400).send({
        status: 'unsuccessful',
        message: 'No title to search for!'
      });
    }
    var searchContents = req.query.q.trim().split(/\s/).filter(function (search) {
      return search !== '';
    });
    var searchQueryContents = searchContents.map(function (searchContent) {
      return { $iLike: '%' + searchContent + '%' };
    });
    var titleSearchQuery = {
      title: {
        $or: searchQueryContents
      }
    };
    var searchQuery = req.body.user.roleType === 'Admin' || req.body.user.roleType === 'SuperAdmin' ? titleSearchQuery : {
      $or: [_extends({ userId: req.body.user.userId }, titleSearchQuery), _extends({ access: req.body.user.roleType }, titleSearchQuery), _extends({ access: 'Public' }, titleSearchQuery)]
    };
    Document.findAndCountAll(_extends({
      where: _extends({}, searchQuery),
      attributes: ['id', 'title', 'body', 'access', 'createdAt']
    }, params)).then(function (documents) {
      if (documents.count > 0) {
        res.status(200).send({
          status: 'successful',
          count: documents.count,
          documents: documents.rows,
          paginationMetaData: (0, _pagination2.default)(documents, params)
        });
      } else {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'No match found!'
        });
      }
    }).catch(function () {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Unable to get document(s)'
      });
    });
  },


  /**
  * Delete a specific document
  * @param {object} req - The request object from express server
  * @param {object} res - The response object from express server
  * @return {null} Returns null
  */
  delete: function _delete(req, res) {
    var documentId = Number(req.params.id);
    var response = {};
    response.status = 'unsuccessful';
    response.message = 'No document found!';
    Document.findById(documentId).then(function (knownDocument) {
      if (!knownDocument) {
        response.message = 'Could not find document!';
        return res.status(400).send(response);
      } else if (knownDocument.userId === req.body.user.userId) {
        knownDocument.destroy().then(function () {
          response.status = 'successful';
          response.message = '"' + knownDocument.title + '" has been deleted!';
          return res.status(200).send(response);
        });
      } else {
        response.status = 'unsuccessful';
        response.message = 'Access denied!';
        return res.status(400).send(response);
      }
    }).catch(function () {
      return res.status(400).send(response);
    });
  }
};