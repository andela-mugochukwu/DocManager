import { createDocument,
         getAllDocuments,
         findDocument,
         getUserDocuments,
         deleteDocument } from '../controller/documentOperations';
import { signUpValidation,
         signInValidation,
         verifyToken } from '../controller/middlewares/validation';
import { signUpUser,
         signInUser,
         getAllUsers,
         findUser,
         updateUser,
         deleteUser,
         findUsers } from '../controller/userOperation';
/**
 * Creates the document model
 * @param {object} router - represents router object from express to use
 * @param {object} compiler - contains information in the webpack
 * @return {null} returns void
 */
const routes = (router) => {
  // route to create a new user
  router.post('/users', signUpValidation, signUpUser);
  // route to signin a user
  router.post('/users/login', signInValidation, signInUser);

  // route to get all users and paginate them
  router.get('/users', verifyToken, getAllUsers);
  // Find a specific user
  router.get('/users/:id', verifyToken, findUser);
  // Update a specific user
  router.put('/users/:id', verifyToken, signUpValidation, updateUser);
  // route to fetch documents belonging to a user
  router.get('/users/:id/documents', verifyToken, getUserDocuments);
  // Deletes a specific user
  router.delete('/users/:id', verifyToken, deleteUser);
  // route to search for users
  router.get('/search/users', verifyToken, findUsers);
  // route to get all documents
  router.get('/documents', verifyToken, getAllDocuments);
  // route to create a new document
  router.post('/documents', verifyToken, createDocument);
  // route to find a specific document
  router.get('/documents/:id', verifyToken, findDocument);
  // route to delete a specific document
  router.delete('/documents/:id', verifyToken, deleteDocument);
};

export default routes;
