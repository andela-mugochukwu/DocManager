import axios from 'axios';
import * as types from './types';

/**
 * Starts creating documents
 * @returns {object} returns the type of data it dispatches
 */
export const startCreatingDocument = () => ({
  type: types.START_CREATING_DOCUMENT,
});

/**
 * Fires when a document was just created
 * @param {object} status - A string indicating the stage
 * of the document creation process
 * @returns {object} returns the type of data it dispatches
 */
export const doneCreatingDocument = status => ({
  type: types.DONE_CREATING_DOCUMENT,
  status
});

/**
 * Fires when there where errors creating a document
 * @param {object} error - An array of server errors after API calls
 * @returns {object} returns the error it dispatches
 */
export const errorCreatingDocument = error => ({
  type: types.ERROR_CREATING_DOCUMENT,
  error
});

/**
 * Creates a document
 * @param {object} formValue - An object containing the document to create
 * @return {func} Returns a function that dispatches actions
 *  in response from the server
 */
export const documentCreation = formValue => (dispatch) => {
  dispatch(startCreatingDocument());
  return axios.post('/api/v1/documents', formValue)
    .then((response) => {
      dispatch(doneCreatingDocument(response.data.status));
      return response.data;
    },
    ({ response }) => {
      dispatch(errorCreatingDocument(response.data));
      return response.data;
    }
    );
};

/**
 * Starts creating documents
 * @returns {object} returns the type of data it dispatches
 */
export const startGetUserDocuments = () => ({
  type: types.START_GET_USER_DOCUMENT,
});

/**
 * Starts creating documents
 * @param {object} documents - An array of documents from api
 * @param {number} count - The total number of documents matched
 * @returns {object} returns the an object containing the
 *  type of action it dispatches
 */
export const completeGetUserDocuments = (documents, count) => ({
  type: types.SUCCESS_GET_USER_DOCUMENT,
  documents,
  count,
});

/**
 * Starts creating documents
 * @param {object} error - The error message when getting user document fails
 * @returns {object} returns the an object containing the
 *  type of action it dispatches
 */
export const errorGetUserDocuments = error => ({
  type: types.ERROR_GET_USER_DOCUMENT,
  error,
});// done fetching own documents

/**
 * Gets all documents created by a given user
 * @param {number} id - The user ID used to fetch documents
 * @return {func} Returns a function that dispatches actions
 *  in response from the server
 */
export const getUserDocuments = id => (dispatch) => {
  const token = localStorage.getItem('docmanagertoken');
  dispatch(startGetUserDocuments());
  return axios.get(`/api/v1/users/${id}/documents?&offset=0&limit=8&token=${token}`)
    .then((response) => {
      dispatch(completeGetUserDocuments(response.data.documents,
      response.data.count));
      return response.data.status;
    }, ({ response }) => {
      dispatch(errorGetUserDocuments(response.data));
      return response.data.status;
    });
};

// fetching public document
/**
 * create an action object for fetching public document
 * @returns {object} returns the an object containing the
 *  type of action it dispatches
 */
export const fetchingPublicDocuments = () => ({
  type: types.START_FETCHING_PUBLIC_DOCUMENTS,
});

/**
 * Creates an action object when fetching public documents completes
 * @param {object} documents - An array of documents from api
 * @param {number} count - The total number of documents matched
 * @returns {object} returns the an object containing the
 *  type of action it dispatches
 */
export const fetchingPublicDocumentsComplete = (documents, count) => ({
  type: types.DONE_FETCHING_PUBLIC_DOCUMENTS,
  documents,
  count,
});

/**
 * Creates an action object when fetching public documents fails
 * @param {object} error - The error message when getting public documents fails
 * @returns {object} returns the an object containing the
 *  type of action it dispatches
 */
export const fetchingPublicDocumentsFailed = error => ({
  type: types.ERROR_FETCHING_PUBLIC_DOCUMENTS,
  error,
}); // done fetching public document

/**
 * Get all public documents accessible by a given user
 * @return {func} Returns a function that dispatches actions
 *  in response from the server
 */
export const publicDocuments = () => (dispatch) => {
  const token = localStorage.getItem('docmanagertoken');
  dispatch(fetchingPublicDocuments());
  return axios.get(`/api/v1/Public/documents?&offset=0&limit=8&token=${token}`)
    .then((response) => {
      dispatch(fetchingPublicDocumentsComplete(response.data.documents,
      response.data.count));
    },
    ({ response }) => {
      dispatch(fetchingPublicDocumentsFailed(response.data.message));
    });
};

// start fetching role documents
/**
 * Create an action object when fetching role base a documents starts
 * @param {string} roleType - The role type used to search through documents
 * @return {object} returns an object containing
 *  the action type and the error message
 */
export const fetchRoleDocuments = roleType => ({
  type: types.START_FETCHING_ROLE_DOCUMENTS,
  roleType: roleType || 'Loading...',
});

/**
 * Create an action object when fetching role base a documents starts
 * @param {string} documents - The role based documents fetched from
 * the database
 * @param {number} count - The total number of documents matched
 * @return {object} returns an object containing
 *  the action type and the error message
 */
export const fetchRoleDocumentsComplete = (documents, count) => ({
  type: types.DONE_FETCHING_ROLE_DOCUMENTS,
  documents,
  count,
});

/**
 * Create an action object when fetching role base a documents fails
 * @param {string} error - The error message
 * @return {object} returns an object containing
 *  the action type and the error message
 */
export const fetchRoleDocumentsFailed = error => ({
  type: types.ERROR_FETCHING_ROLE_DOCUMENTS,
  error,
});
// done fetching role documents

/**
 * Fetches all role based documents
 * @param {*} roleType  - The role a user belongs to
 * @return {func} Returns a function that dispatches actions
 *  in response from the server
 */
export const roleDocuments = roleType => (dispatch) => {
  const token = localStorage.getItem('docmanagertoken');
  dispatch(fetchRoleDocuments());
  return axios.get(`/api/v1/${roleType}/documents?&offset=0&limit=8&token=${token}`)
  .then((response) => {
    dispatch(fetchRoleDocumentsComplete(response.data.documents,
    response.data.count));
  },
    ({ response }) => {
      dispatch(fetchRoleDocumentsFailed(response.data.message));
    });
};

// start fetching all documents
/**
 * Create an action object when getting all document starts
 * @return {object} returns an object containing
 *  the action type and the error message
 */
export const fetchAllDocuments = () => ({
  type: types.START_FETCHING_ALL_DOCUMENTS,
});

/**
 * Create an action object when getting all document completes
 * @param {string} documents - The documents from the server
 * @param {number} count - The total number of documents matched
 * @return {object} returns an object containing
 *  the action type and the documents
 */
export const fetchAllDocumentsComplete = (documents, count) => ({
  type: types.DONE_FETCHING_ALL_DOCUMENTS,
  documents,
  count,
});

/**
 * Create an action object when getting all documents fails
 * @param {string} error - The error message
 * @return {object} returns an object containing
 *  the action type and the error message
 */
export const fetchAllDocumentsFailed = error => ({
  type: types.ERROR_FETCHING_ALL_DOCUMENTS,
  error
});// done fetching all documents

/**
 * Fetches all documents a user can access
 * @param {string} roletype  - The role a user belongs to
 * @return {func} Returns a function that dispatches actions
 *  in response from the server
 */
export const allDocuments = roletype => (dispatch) => {
  const token = localStorage.getItem('docmanagertoken');
  const url = roletype !== 'Admin' ?
  `/api/v1/All/documents?&offset=0&limit=8&token=${token}`
  : `/api/v1/documents?&offset=0&limit=8&token=${token}`;
  dispatch(fetchAllDocuments());
  return axios.get(url).then((response) => {
    dispatch(fetchAllDocumentsComplete(response.data.documents,
    response.data.count));
  },
    ({ response }) => {
      dispatch(fetchAllDocumentsFailed(response.data.message));
    });
};

/**
 * Create an action object when reading a document starts
 * @param {string} docId - The Id of the document
 * @return {object} returns an object containing
 *  the action type and the document ID
 */
export const readADocument = docId => ({
  type: types.START_READING_DOCUMENT,
  docId,
});

/**
 * Create an action object when reading a document completes
 * @param {string} document - The document to read
 * @return {object} returns an object containing
 *  the action type and the document
 */
export const readDocumentComplete = document => ({
  type: types.DONE_READING_DOCUMENT,
  document,
});

/**
 * Create an action object when reading a document fails
 * @param {string} error - The error message
 * @return {object} returns an object containing
 *  the action type and the error message
 */
export const readDocumentFailed = error => ({
  type: types.ERROR_READING_DOCUMENT,
  error,
});

/**
 * Reads a particular document
 * @param {number} id  - The document id to view
 * @return {func} Returns a function that dispatches actions
 *  in response from the server
 */
export const readDocument = id => (dispatch) => {
  const userToken = localStorage.getItem('docmanagertoken');
  dispatch(readADocument(id));
  return axios.get(`/api/v1/documents/${id}?&offset=0&limit=8&token=${userToken}`)
  .then((response) => {
    dispatch(readDocumentComplete(response.data.document));
    return response.data;
  },
    ({ response }) => {
      dispatch(readDocumentFailed(response.data.message));
      return response.data;
    });
};

/**
 * Create an action object when deleting a document starts
 * @param {string} docId - The ID of the document to delete
 * @return {object} returns an object containing
 *  the action type and the document id
 */
export const deleteDocumentStart = docId => ({
  type: types.START_DELETING_DOCUMENT,
  docId,
});

/**
 * Create an action object when deleting a document is successful
 * @param {string} message - The status message when deleting completes
 * @return {object} returns an object containing
 *  the action type and the error message
 */
export const deleteDocumentComplete = message => ({
  type: types.DONE_DELETING_DOCUMENT,
  message,
});

/**
 * Create an action object when deleting a document fails
 * @param {string} error - The error message
 * @return {object} returns an object containing
 *  the action type and the error message
 */
export const deleteDocumentFailed = error => ({
  type: types.ERROR_DELETING_DOCUMENT,
  error,
});

/**
 * Deletes a particular document
 * @param {number} id  - The document id to delete
 * @return {func} Returns a function that dispatches actions
 *  in response from the server
 */
export const deleteDocument = id => (dispatch) => {
  const userToken = localStorage.getItem('docmanagertoken');
  dispatch(deleteDocumentStart(id));
  return axios.delete(`/api/v1/documents/${id}?&offset=0&limit=8&token=${userToken}`)
  .then((response) => {
    dispatch(deleteDocumentComplete(response.data.message));
    return response.data;
  },
    ({ response }) => {
      dispatch(deleteDocumentFailed(response.data.message));
      return response.data;
    });
};

/**
 * Dispatches an action when searching is successful
 * @param {string} documents - The documents that matches the search parameter
 * @param {number} count - the total number of searched document
 *  number of document
 * @param {number} pageNumber - the page number in view
 *  number of document
 * @return {object} contains the type of action dispatched
 * as well as the documents matching the search parameter
 */
export const doneSearchingDocuments = (documents, count, pageNumber) => ({
  type: types.DONE_SEARCHING_DOCUMENTS,
  documents,
  count,
  pageNumber,
});

/**
 * Dispatches an action when searching fails
 * @param {string} error - The error message after searching documents failed
 * @return {object} contains the type of action dispatched
 * as well as the error message
 */
export const errorSearchingDocuments = error => ({
  type: types.ERROR_SEARCHING_DOCUMENTS,
  error,
});

/**
 * Dispatches actions that handles events that search through documents
 * @param {string} searchText - The search parameter
 * @return {object} returns a promise
 */
export const searchDocuments = searchText => (dispatch) => {
  const userToken = localStorage.getItem('docmanagertoken');
  return axios
  .get(`/api/v1/search/documents?q=${searchText}&offset=0&limit=8&token=${userToken}`)
  .then((response) => {
    dispatch(doneSearchingDocuments(response.data.documents,
      response.data.count, 1));
  },
    ({ response }) => {
      dispatch(errorSearchingDocuments(response.data.message));
      return response.data;
    });
};

/**
 * Paginates the documents from the database
 * @param {number} pageNumber - The current page number
 * @param {number} offSet - The document offset to start fetching documents
 * @param {string} documentAccess - The access level of the document to search for
 * @param {string} searchText - The search text used for querying the database
 * @param {string} roleType - The role the user belongs to
 * @param {number} id - The userId searching the document
 * @return {null} returns void
 */
export const paginateDocument = (pageNumber, offSet,
  documentAccess, searchText, roleType, id) => (dispatch) => {
    const userToken = localStorage.getItem('docmanagertoken');
    let url = '';
    switch (documentAccess) {
    case 'Private':
      url = `/api/v1/users/${id}/documents?&offset=${offSet}&limit=8&token=${userToken}`;
      break;
    case 'Public':
      url = `/api/v1/Public/documents?&offset=${offSet}&limit=8&token=${userToken}`;
      break;
    case 'Role':
      url =
      `/api/v1/${roleType}/documents?&offset=${offSet}&limit=8&token=${userToken}`;
      break;
    case 'All':
      url = roleType !== 'Admin' ?
        `/api/v1/All/documents?&offset=${offSet}&limit=8&token=${userToken}`
        : `/api/v1/documents?&offset=${offSet}&limit=8&token=${userToken}`;
      break;
    default:
      url = `/api/v1/search/documents?q=${searchText}&offset=${offSet}&limit=8&token=${userToken}`;
      break;
    }
    return axios
  .get(url)
  .then((response) => {
    dispatch(doneSearchingDocuments(response.data.documents,
      response.data.count, pageNumber));
  },
    ({ response }) => {
      dispatch(errorSearchingDocuments(response.data.message));
      return response.data;
    });
  };

