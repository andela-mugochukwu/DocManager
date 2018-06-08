import * as types from '../actions/types';

/**
 * Manages actions that controls document creation
 * @param {object} state - The redux state of the application
 * that manages authentication
 * @param {object} action - The dispatched action from redux
 * action creators
 * @return {object} returns the updated state of the application
 */
export const createDoc = (state = {
  status: 'Unsuccessful',
  errors: [],
}, action) => {
  switch (action.type) {
  case types.START_CREATING_DOCUMENT:
    return Object.assign({}, state, {
      status: 'Creating document...',
    });
  case types.DONE_CREATING_DOCUMENT:
    return Object.assign({}, state, {
      status: 'Successful',
    });
  case types.ERROR_CREATING_DOCUMENT:
    return Object.assign({}, state, {
      status: 'Unsuccessful',
      errors: action.error.message,
    });
  default:
    return state;
  }
};

/**
 * Manages actions that controls reading a particular document
 * @param {object} state - The redux state of the application
 * that manages authentication
 * @param {object} action - The dispatched action from redux
 * action creators
 * @return {object} returns the updated state of the application
 */
export const readDocument = (state = {
  status: 0,
  delStatus: 0,
  error: '',
  message: '',
  docStatus: 'submit',
  documentTitle: '',
  document: {},
}, action) => {
  switch (action.type) {
  case types.START_READING_DOCUMENT:
    return Object.assign({}, state, {
      status: action.docId,
      document: '',
    });
  case types.DONE_READING_DOCUMENT:
    return Object.assign({}, state, {
      status: 0,
      document: action.document,
      documentTitle: action.document.title,
    });
  case types.START_EDITING_DOCUMENT:
    return Object.assign({}, state, {
      docStatus: 'Editing',
    });
  case types.DONE_EDITING_DOCUMENT:
    return Object.assign({}, state, {
      docStatus: 'submit',
    });
  case types.ERROR_EDITING_DOCUMENT:
    return Object.assign({}, state, {
      docStatus: 'submit',
    });
  case types.UPDATE_TITLE:
    return Object.assign({}, state, {
      documentTitle: action.title,
    });
  case types.ERROR_READING_DOCUMENT:
    return Object.assign({}, state, {
      status: 0,
      document: {},
      error: action.error
    });
  default:
    return state;
  }
};

/**
 * Manages actions that controls fetching documents from storage
 * @param {object} state - The redux state of the application
 * that manages authentication
 * @param {object} action - The dispatched action from redux
 * action creators
 * @return {object} returns the updated state of the application
 */
export const fetchDocuments = (state = {
  isReady: false,
  status: 'Loading my documents...',
  documents: [],
  documentType: '',
  documentCounter: 0,
  currentPage: 1,
  delStatus: 0,
  error: '',
  message: '',
  documentaccess: 'All',
}, action) => {
  switch (action.type) {
  case types.START_DELETING_DOCUMENT:
    return Object.assign({}, state, {
      delStatus: action.docId,
      message: '',
    });
  case types.DONE_DELETING_DOCUMENT:
    return Object.assign({}, state, {
      delStatus: 0,
      message: action.message,
      documents: state.documents
        .filter(document => document.id !== action.docId),
    });
  case types.ERROR_DELETING_DOCUMENT:
    return Object.assign({}, state, {
      delStatus: 0,
      error: action.error
    });
  case types.DONE_SEARCHING_DOCUMENTS:
    return Object.assign({}, state, {
      documents: action.documents,
      isReady: true,
      documentaccess: action.access || '',
      currentPage: action.pageNumber,
      documentCounter: action.count,
    });
  case types.ERROR_SEARCHING_DOCUMENTS:
    return Object.assign({}, state, {
      status: action.error,
      documentCounter: 0,
      isReady: false,
    });
  case types.START_GET_USER_DOCUMENT:
    return Object.assign({}, state, {
      isReady: false,
      documents: [],
      status: 'Loading my documents...',
    });
  case types.SUCCESS_GET_USER_DOCUMENT:
    return Object.assign({}, state, {
      isReady: true,
      documentType: 'Private',
      documentaccess: 'Private',
      documents: action.documents,
      documentCounter: action.count,
    });
  case types.ERROR_GET_USER_DOCUMENT:
    return Object.assign({}, state, {
      status: action.error.message,
      isReady: false,
      documentCounter: 0,
    });

  case types.START_FETCHING_PUBLIC_DOCUMENTS:
    return Object.assign({}, state, {
      status: 'Loading public documents...',
      isReady: false,
      documents: [],
    });

  case types.DONE_FETCHING_PUBLIC_DOCUMENTS:
    return Object.assign({}, state, {
      isReady: true,
      documentType: 'Public',
      documentaccess: 'Public',
      documents: action.documents,
      documentCounter: action.count,
    });

  case types.ERROR_FETCHING_PUBLIC_DOCUMENTS:
    return Object.assign({}, state, {
      status: action.error,
      isReady: false,
      documents: [],
      documentCounter: 0,
    });

  case types.START_FETCHING_ALL_DOCUMENTS:
    return Object.assign({}, state, {
      status: 'Loading all documents...',
      isReady: false,
      documents: [],
    });

  case types.DONE_FETCHING_ALL_DOCUMENTS:
    return Object.assign({}, state, {
      isReady: true,
      documentType: 'All',
      documentaccess: 'All',
      documents: action.documents,
      documentCounter: action.count,
    });

  case types.ERROR_FETCHING_ALL_DOCUMENTS:
    return Object.assign({}, state, {
      status: action.error,
      documents: [],
      isReady: false,
      documentCounter: 0,
    });

  case types.START_FETCHING_ROLE_DOCUMENTS:
    return Object.assign({}, state, {
      status: action.roleType,
      isReady: false,
      documents: [],
    });

  case types.DONE_FETCHING_ROLE_DOCUMENTS:
    return Object.assign({}, state, {
      isReady: true,
      documentType: 'Role',
      documentaccess: action.roleType,
      documents: action.documents,
      documentCounter: action.count,
    });

  case types.ERROR_FETCHING_ROLE_DOCUMENTS:
    return Object.assign({}, state, {
      isReady: false,
      documents: [],
      status: action.error,
      documentCounter: 0,
    });
  default:
    return state;
  }
};
