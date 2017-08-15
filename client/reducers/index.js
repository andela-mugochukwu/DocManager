import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import { authenticateUser, fetchAllUsers, deactivateUser }
  from './userReducers';
import { createDoc, fetchDocuments, readDocument } from './documentReducers';

const appReducer = combineReducers({
  authenticateUser,
  createDoc,
  fetchDocuments,
  readDocument,
  fetchAllUsers,
  deactivateUser,
  routing
});
const rootReducer = (state, action) => {
  if (action.type === 'USER_SIGNOUT') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
