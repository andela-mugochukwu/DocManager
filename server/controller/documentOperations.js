import index from '../models';

const Document = index.Document;
const User = index.User;
module.exports = {
  /**
 * function to create a document
 * @param {object} req - an object that contains the request body
 * @param {object} res - an object that contains the response body
 * @return {boolean} it returns true if the document was created
 * and false otherwise
 */
  create(req, res) {
    const title = req.body.title || '';
    const body = req.body.body || '';
    const userId = req.body.user.userId;
    const access = req.body.access || '';
    // Don't create document if fields are empty
    if (title === '' || body === '' || access === '') {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Empty title or body or access field!',
      });
    } else {
      // check to see if document with same title exist before creation
      Document.findOrCreate({
        where: { title },
        defaults: {
          body,
          access,
          userId
        }
      }).spread((docCreated, isCreated) => {
        if (isCreated) {
          res.status(200).send({
            status: 'successful',
            documentId: docCreated.id,
          });
        } else {
          res.status(400).send({
            status: 'unsuccessful',
            message: 'Document already exist!',
          });
        }
      }).catch(() => {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'Could not create your document!',
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
  getUserDocuments(req, res) {
    const params = { offset: req.query.offset || 0,
      limit: req.query.limit || 8 };
    Document.findAndCountAll({
      where: { userId: req.body.user.userId },
      attributes: ['id', 'title', 'body', 'userId', 'access', 'createdAt'],
      ...params
    }).then((documents) => {
      if (documents.count > 0 &&
        Number(req.params.id) === req.body.user.userId) {
        res.status(200).send({
          status: 'successful',
          count: documents.count,
          documents: documents.rows,
          curPage: parseInt(params.offset / params.limit, 10) + 1,
          pageCount: Math.ceil(documents.count / params.limit),
          pageSize: params.limit,
        });
      } else {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'No document found!',
        });
      }
    }).catch(() => {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Invalid user ID!',
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
  getAll(req, res) {
    const access = req.params.access;
    const params = { offset: req.query.offset || 0,
      limit: req.query.limit || 8 };
    let searchQuery = {};
    switch (access) {
    case 'Public':
      searchQuery = { access };
      break;
    case 'Amin':
    case 'SuperAdmin':
    case 'Learning':
    case 'Devops':
    case 'Fellow':
      if (req.body.user.roleType === access) {
        searchQuery = { access };
      } else {
        searchQuery = null;
      }
      break;
    case 'All':
      searchQuery = {
        $or:
        [{ userId: req.body.user.userId },
        { access: req.body.user.roleType },
        { access: 'Public' }]
      };
      break;
    default:
      if (req.body.user.roleType === 'Admin'
      || req.body.user.roleType === 'SuperAdmin') {
        searchQuery = {};
      } else {
        searchQuery = null;
      }
      break;
    }
    if (searchQuery) {
      Document.findAndCountAll({
        where: {
          ...searchQuery,
        },
        attributes: ['id', 'title', 'body', 'userId', 'access', 'createdAt'],
        ...params
      }).then((foundDocuments) => {
        const response = {};
        response.status = 'unsuccessful';
        response.message = 'No document found!';
        res.status(400);
        if (foundDocuments.count > 0) {
          response.status = 'successful';
          response.message = '';
          response.count = foundDocuments.count;
          response.documents = foundDocuments.rows;
          response.curPage = parseInt(params.offset / params.limit, 10) + 1;
          response.pageCount =
          Math.ceil(foundDocuments.count / params.limit);
          response.pageSize = foundDocuments.rows.length;
          res.status(200);
        }
        res.send(response);
      }).catch(() => {
        res.status(500).send({
          status: 'unsuccessful',
          message: 'An error occured while fetching documents!',
        });
      });
    } else {
      console.log(searchQuery, '......');
      return res.status(400).send({
        status: 'unsuccessful',
        message: 'Access denied!',
      });
    }
  },

  /**
 * function to fetch a specific document from the database
 * @param {object} req - an object that contains the request body
 * @param {object} res - an object that contains the response body
 * @return {null} it returns no value
 */
  find(req, res) {
    const documentId = Number(req.params.id);
    if (Number.isInteger(documentId) && documentId > 0) {
      Document.findOne({
        where: { id: documentId },
      }).then((foundDocument) => {
        User.findById(foundDocument.userId).then((documentOwner) => {
          foundDocument.dataValues.author = documentOwner.username;
          if (foundDocument) {
            let doc = {};
            switch (foundDocument.access) {
            case 'Private':
              if (foundDocument.userId === req.body.user.userId ||
                  req.body.user.roleType === 'Admin'
                || req.body.user.roleType === 'SuperAdmin') {
                doc = foundDocument;
              }
              break;
            case 'Public':
              doc = req.body.user.userId
              ? foundDocument : {};
              break;
            case req.body.user.roleType:
              if (foundDocument.access === req.body.user.roleType) {
                doc = foundDocument;
              }
              break;
            default:
              if (req.body.user.roleType === 'Admin'
              || req.body.user.roleType === 'SuperAdmin') {
                doc = foundDocument;
              } else {
                return res.status(400).send({
                  status: 'unsuccessful',
                  message: 'Access denied!',
                });
              }
            }
            res.status(200).send({
              status: 'successful',
              document: doc,
            });
          } else {
            res.status(400).send({
              status: 'unsuccessful',
              message: 'Could not find any document!',
            });
          }
        });
      }).catch((err) => {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'An error coccured while loading your document!',
          err
        });
      });
    } else {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Invalid search parameter!',
      });
    }
  },

  /**
 * Update a particular document
 * @param {object} req - The request object from express server
 * @param {object} res - The response object from express server
 * @return {null} Returns null
 */
  update(req, res) {
    const documentId = Number(req.params.id);
    const userDocument = {};
    if (req.body.title) {
      userDocument.title = req.body.title;
    }
    if (req.body.body) {
      userDocument.body = req.body.body;
    }
    if (req.body.access) {
      userDocument.access = req.body.access;
    }
    Document.findById(documentId).then((foundDocument) => {
      if (foundDocument.userId === req.body.user.userId
        || req.body.user.roleType === 'Admin'
      || req.body.user.roleType === 'SuperAdmin') {
        Document.update(userDocument, {
          where: {
            id: documentId,
          }
        }).then(() => {
          if (Object.keys(userDocument).length !== 0) {
            res.status(200).send({
              status: 'successful',
            });
          } else {
            res.status(400).send({
              status: 'unsuccessful',
              message: 'No new value to update document!',
            });
          }
        }).catch(() => {
          res.status(400).send({
            status: 'unsuccessful',
            message: 'Could not find any document to update!',
          });
        });
      } else {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'Restricted document!',
        });
      }
    }).catch(() => {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Could not find any document to update!',
      });
    });
  },

  /**
 * Searches through documents for a given title
 * @param {object} req - The request object from express server
 * @param {object} res - The response object from express server
 * @return {null} Returns null
 */
  search(req, res) {
    const params = { offset: req.query.offset || 0,
      limit: req.query.limit || 8 };
    if (!req.query.q) {
      return res.status(400).send({
        status: 'unsuccessful',
        message: 'No title to search for!'
      });
    }
    const searchContents = req.query.q.split(' ')
    .filter(search => search !== ' ');
    const searchQueryContents = searchContents
    .map(searchContent => ({ $iLike: `%${searchContent}%` }));
    const titleSearchQuery = {
      title: {
        $or: searchQueryContents,
      },
    };
    let searchQuery = req.body.user.roleType === 'Admin'
    || req.body.user.roleType === 'SuperAdmin' ?
      titleSearchQuery : {
        $or:
        [{ userId: req.body.user.userId, ...titleSearchQuery },
        { access: req.body.user.roleType, ...titleSearchQuery },
        { access: 'Public', ...titleSearchQuery }]
      };

    if (!req.query.q) {
      searchQuery = req.body.user.roleType === 'Admin'
      || req.body.user.roleType === 'SuperAdmin' ?
        {} : {
          $or:
          [{ userId: req.body.user.userId },
          { access: req.body.user.roleType },
          { access: 'Public' }]
        };
    }
    Document.findAndCountAll({
      where: { ...searchQuery },
      attributes: ['id', 'title', 'body', 'access', 'createdAt'],
      ...params
    }).then((documents) => {
      if (documents.count > 0) {
        res.status(200).send({
          status: 'successful',
          count: documents.count,
          documents: documents.rows,
          curPage: parseInt(params.offset / params.limit, 10) + 1,
          pageCount: Math.ceil(documents.count / params.limit),
          pageSize: documents.rows.length
        });
      } else {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'No match found!',
        });
      }
    }).catch(() => {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Unable to get document(s)',
      });
    });
  },

  /**
 * Delete a specific document
 * @param {object} req - The request object from express server
 * @param {object} res - The response object from express server
 * @return {null} Returns null
 */
  delete(req, res) {
    const documentId = Number(req.params.id);
    const response = {};
    response.status = 'unsuccessful';
    response.message = 'No document found!';
    Document.findById(documentId).then((knownDocument) => {
      if (!knownDocument) {
        response.message = 'Could not find document!';
        return res.status(400).send(response);
      } else if (knownDocument.userId === req.body.user.userId) {
        knownDocument.destroy().then(() => {
          response.status = 'successful';
          response.message = `"${knownDocument.title}" has been deleted!`;
          return res.status(200).send(response);
        });
      } else {
        response.status = 'unsuccessful';
        response.message = 'Access denied!';
        return res.status(400).send(response);
      }
    }).catch(() => res.status(400).send(response));
  },
};
