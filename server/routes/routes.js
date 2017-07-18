import { createDocument,
         getAllDocuments,
         findDocument,
         getUserDocuments,
         deleteDocument } from '../controller/documentOperations';
import { signUpValidation,
         signInValidation,
         verifyToken,
         allowOnlyAdmin } from '../controller/middlewares/validation';
import { signUpUser,
         signInUser,
         getAllUsers,
         findUser,
         updateUser,
         deleteUser,
         findUsers } from '../controller/userOperation';
import createRole from '../controller/roleOperation';
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

  router.use(verifyToken);
  // Update a specific user
  router.put('/users/:id', signUpValidation, updateUser);
  // route to create role
  router.post('/role', allowOnlyAdmin, createRole);
  // route to get all users and paginate them
  router.get('/users', allowOnlyAdmin, getAllUsers);
  // Find a specific user
  router.get('/users/:id', allowOnlyAdmin, findUser);
  // Deletes a specific user
  router.delete('/users/:id', allowOnlyAdmin, deleteUser);
  // route to search for users
  router.get('/search/users', allowOnlyAdmin, findUsers);
  // route to fetch documents belonging to a user
  router.get('/users/:id/documents', getUserDocuments);
  // route to get all documents
  router.get('/documents', getAllDocuments);
  // route to create a new document
  router.post('/documents', createDocument);
  // route to find a specific document
  router.get('/documents/:id', findDocument);
  // route to delete a specific document
  router.delete('/documents/:id', deleteDocument);
};

export default routes;
