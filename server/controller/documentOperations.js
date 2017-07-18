import index from '../models';

const document = index.Document;
/**
 * function to create a document
 * @param {object} req - an object that contains the request body
 * @param {object} res - an object that contains the response body
 * @return {boolean} it returns true if the document was created
 * and false otherwise
 */
const createDocument = (req, res) => {
  const title = typeof req.body.title === 'undefined' ?
    '' : req.body.title;
  const body = typeof req.body.body === 'undefined' ?
    '' : req.body.body;
  const userId = typeof req.body.userId === 'undefined' ?
    '' : req.body.userId;
  const access = typeof req.body.access === 'undefined' ?
    '' : req.body.access;
  // Don't create document if fields are empty
  if (title === '' || body === '' || access === '') {
    res.send({
      status: 'unsuccessful',
      message: 'Empty title or body or access field!',
    });
  } else {
    // check to see if document with same title exist before creation
    document.findOrCreate({
      where: { title },
      defaults: {
        body,
        access,
        userId
      }
    }).spread((docCreated, isCreated) => {
      if (isCreated) {
        res.send({
          status: 'successful'
        });
      } else {
        res.send({
          status: 'unsuccessful',
          message: 'Document already exist!',
        });
      }
    }).catch(() => {
      res.send({
        status: 'unsuccessful',
        message: 'Could not create the document!',
      });
    });
  }
};
/**
 * function to fetch all documents from the database
 * @param {object} req - an object that contains the request body
 * @param {object} res - an object that contains the response body
 * @return {null} it returns no value
 */
const getAllDocuments = (req, res) => {
  const searchParams = req.query;
  let params;
  // check it limit and offset where passed
  if (searchParams.offset && searchParams.limit) {
    params = { offset: searchParams.offset, limit: searchParams.limit };
  }
  document.findAndCountAll({
    attributes: ['id', 'title', 'body', 'access', 'createdAt'],
    ...params
  }).then((documents) => {
    res.send({
      status: 'successful',
      count: documents.count,
      documents: documents.rows,
    });
  }).catch(() => {
    res.send({
      status: 'unsuccessful',
      message: 'Could not fetch all documents!',
    });
  });
};
/**
 * function to fetch all documents belonging to a user from the database
 * @param {object} req - an object that contains the request body
 * @param {object} res - an object that contains the response body
 * @return {null} it returns no value
 */
const getUserDocuments = (req, res) => {
  const userId =
    (req.params.id > 0 && Number.isInteger(Number(req.params.id))) ?
      req.params.id : 0;
  document.findAndCountAll({
    where: {
      userId,
    },
  }).then((documents) => {
    if (documents.count > 0) {
      res.status(200).send({
        status: 'successful',
        userId,
        userName: req.query.userName,
        documents: documents.rows,
      });
    } else {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'No document was found',
      });
    }
  }).catch(() => {
    res.status(400).send({
      status: 'unsuccessful',
      message: 'Could not fetch all your documents!',
    });
  });
};
/**
 * function to fetch a specific document from the database
 * @param {object} req - an object that contains the request body
 * @param {object} res - an object that contains the response body
 * @return {null} it returns no value
 */
const findDocument = (req, res) => {
  const documentId = req.params.id;
  if (documentId > 0 && Number.isInteger(Number(req.params.id))) {
    document.findById(documentId).then((foundDocument) => {
      if (foundDocument === null) {
        res.send({
          status: 'unsuccessful',
          message: 'Could not find the document!',
        });
      } else {
        res.send({
          status: 'successful',
          document: foundDocument,
        });
      }
    }).catch(() => {
      res.send({
        status: 'unsuccessful',
        message: 'Could not find any document!',
      });
    });
  } else {
    res.send({
      status: 'unsuccessful',
      message: 'Invalid search parameter!',
    });
  }
};

/**
 * Delete a specific document
 * @param {object} req - The request object from express server
 * @param {object} res - The response object from express server
 * @return {null} Returns null
 */
const deleteDocument = (req, res) => {
  const documentId = req.params.id;
  if (documentId > 0 && Number.isInteger(Number(req.params.id))) {
    document.findById(documentId).then((knownDocument) => {
      if (knownDocument === null) {
        res.send({
          status: 'unsuccessful',
          message: 'Could not find any document!',
        });
      } else {
        knownDocument.destroy().then(() => {
          res.send({
            status: 'successful',
            message: `"${knownDocument.title}" has been deleted!`,
          });
        }).catch(() => {
          res.send({
            status: 'unsuccessful',
            message: 'Could not delete the document!',
          });
        });
      }
    }).catch(() => {
      res.send({
        status: 'unsuccessful',
        message: 'No document found!',
      });
    });
  } else {
    res.send({
      status: 'unsuccessful',
      message: 'No document found!',
    });
  }
};

export { createDocument, getAllDocuments, findDocument, getUserDocuments,
  deleteDocument };
