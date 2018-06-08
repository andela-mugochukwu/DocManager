import axios from 'axios';
import * as types from './types';

/**
 * Creates an action object when signin starts
 * @return {object} returns an object containing action type
 */
export const startSignInUser = () => ({
  type: types.START_SIGNIN,
});

/**
 * Creates an action object when signin completes successfully
 * @param {object} userDetail - User information from signin process
 * @return {object} returns an object containing user details and action type
 */
export const finishSignInUser = userDetail => ({
  type: types.SUCCESSFUL_SIGNIN,
  userDetail,
});

/**
 * Creates an action object when signin error occurs
 * @param {object} errors - Errors from signin process
 * @return {object} returns an object containing errors and action type
 */
export const errorSignInUser = errors => ({
  type: types.FAILED_SIGNIN,
  errors,
});

/**
 * Creates an action object when getting user role
 * @param {object} userRole - Role the current user belongs to
 * @return {object} returns an object containing user role and action type
 */
export const setUserRole = userRole => ({
  type: types.SET_USER_ROLE,
  userRole,
});

/**
 * Dispatches an action to sign in a user
 * @param {object} user - Form data to send to the server
 * @return {func} returns a function that will be executed to signin a user
 */
export const signInUser = user => (dispatch) => {
  dispatch(startSignInUser());
  return axios.post('/api/v1/users/login', user)
    .then((response) => {
      localStorage.setItem('docmanagertoken', response.data.token);
      dispatch(setUserRole(response.data.roleType));
      dispatch(finishSignInUser(response.data));
      return response.data;
    },
    ({ response }) => {
      dispatch(errorSignInUser(response.data.message));
      return response.data;
    }
    );
};

/**
 * Creates an action object when signin starts
 * @return {object} returns an object containing action type
 */
export const startSignUpUser = () => ({
  type: types.START_SIGNUP,
});

/**
 * Creates an action object when signup completes successfully
 * @param {object} userDetail - User information from signup process
 * @return {object} returns an object containing user details and action type
 */
export const finishSignUpUser = userDetail => ({
  type: types.SUCCESSFUL_SIGNUP,
  userDetail,
});

/**
 * Creates an action object when signup error occurs
 * @param {object} errors - Errors from signin process
 * @return {object} returns an object containing errors and action type
 */
export const errorSignUpUser = errors => ({
  type: types.FAILED_SIGNUP,
  errors,
});

/**
 * Dispatches an action to sign in a user
 * @param {object} user - Form data to send to the server
 * @return {func} returns a function that will be executed to signin a user
 */
export const signUserUp = user => (dispatch) => {
  dispatch(setUserRole(user.roleValue));
  dispatch(startSignUpUser());
  return axios.post('/api/v1/users', user)
    .then((response) => {
      localStorage.setItem('docmanagertoken', response.data.token);
      dispatch(finishSignUpUser(response.data));
      return response.data;
    },
    ({ response }) => {
      dispatch(errorSignUpUser(response.data.message));
      return response.data;
    });
};
/**
 * Creates an action object that indicates that the system is fetching users
 * @return {object} returns an object containing
 * details about the dispatched action
 */
export const startGettingUsers = () => ({
  type: types.START_GETTING_ALL_USERS,
});

/**
 * Creates an action object that indicates that the system has fetched all users
 * @param {object} users - The array of users from the database
 * @param {string} responseStatus - Error message from the server
 * @param {number} count - the number of users fetched from api
 * @param {number} pageNumber - The number of pages when paginating
 * @return {object} returns an object containing
 * details about the dispatched action
 */
export const finishGettingUsers = (users, responseStatus, count,
  pageNumber) => ({
    type: types.FINISH_GETTING_ALL_USERS,
    users,
    responseStatus,
    count,
    pageNumber,
  });

/**
 * Creates an action object that indicates that the system is fetching users
 * @param {string} error - The error message
 * @param {string} responseStatus - Error message from the server
 * @return {object} returns an object containing
 * details about the dispatched action
 */
export const errorGettingUsers = (error, responseStatus) => ({
  type: types.ERROR_GETTING_ALL_USERS,
  error,
  responseStatus,
});

/**
 * Dispatches an action to get all users
 * @param {object} offset - the offset for fetching pages
 * @param {number} pageNumber - the current page number
 * @return {func} returns a function that will be executed to signin a user
 */
export const fetchAllUsers = (offset = 0, pageNumber) => (dispatch) => {
  const token = localStorage.getItem('docmanagertoken');
  dispatch(startGettingUsers());
  return axios.get(`/api/v1/users?&offset=${offset}&limit=8&token=${token}`)
    .then((response) => {
      dispatch(finishGettingUsers(response.data.users, response.data.status,
      response.data.count, pageNumber));
    },
    ({ response }) => {
      dispatch(errorGettingUsers(response.data.message, response.data.status,
      response.data.count, pageNumber));
    });
};

/**
 * Creates an action object that indicates that the system is fetching users
 * @return {object} returns an object containing
 * details about the dispatched action
 */
export const updatingUser = () => ({
  type: types.START_UPDATING_USER,
});

/**
 * Creates an action object that updates the
 * state with the status of updating operation
 * @param {string} status - the status of the updating process
 * @return {object} returns an object containing the type of action fired
 * as well as the status of the request
 */
export const doneUpdatingUser = status => ({
  type: types.DONE_UPDATING_USER,
  status,
});

/**
 * Creates an action object that updates the
 * state with the status of updating user profile operation fails
 * @param {string} error - the error message when updating a user
 * @return {object} returns an object containing the type of action fired
 * as well as the status of the request
 */
export const errorUpdatingUser = error => ({
  type: types.ERROR_UPDATING_USER,
  error,
});

export const editUserDetail = (userDetail, userId) => (dispatch) => {
  const token = localStorage.getItem('docmanagertoken');
  dispatch(updatingUser());
  return axios.put(`/api/v1/users/${userId}?token=${token}`, userDetail)
    .then((response) => {
      dispatch(doneUpdatingUser(response.data.status));
      return response.data.status;
    },
    ({ response }) => {
      dispatch(errorUpdatingUser(response.data.message));
      return response.data.status;
    });
};

/**
 * Returns an action object that updates the eamil prop of the app state
 * @param {string} inputValue - the new value of email
 * @return {object} returns an object containing the type of
 * action as well as the email update
 */
export const setEmailInputValue = inputValue => ({
  type: types.UPDATE_EMAIL,
  email: inputValue,
});

/**
 * Dispatches the function that updates the eamil prop of the app state
 * @param {string} inputValue - the new value of email
 * @return {func} returns a function that dispatches an
 * action that update an input email in the state
 */
export const changeInputValue = inputValue => (dispatch) => {
  dispatch(setEmailInputValue(inputValue));
};

/**
 * Returns an action object that updates the app state after
 * successful deactivation of user
 * @param {number} userId - the userId to update
 * @param {string} status - the status of the request made to a remote api
 * @return {object} returns an object containing the type of
 * action, userId as well as the status of the request
 */
export const doneDeactivatingUser = (userId, status) => ({
  type: types.DONE_DEACTIVATING_USER,
  status,
  userId,
});

/**
 * Returns an action object that updates the app state after
 * an error occurred while deactivating a user
 * @return {object} returns an object the contains the type of action fired
 */
export const errorDeactivatingUser = () => ({
  type: types.ERROR_DEACTIVATING_USER,
});

/**
 * Dispatches an action that updates the app state
 * while deactivating a user
 * @param {number} userId - the userId to deactivate
 * @return {func} returns a function that dispatches
 * an action that updates a userprofile
 */
export const deactivateUser = userId => (dispatch) => {
  const token = localStorage.getItem('docmanagertoken');
  return axios.delete(`/api/v1/users/${userId}?token=${token}`)
    .then((response) => {
      dispatch(doneDeactivatingUser(userId, response.data.status));
      return response.data;
    },
    ({ response }) => {
      dispatch(errorDeactivatingUser(response.data.status,
        response.data.message));
      return response.data;
    });
};

/**
 * signs out a user
 * @return {object} returns an object that contains the type of action executed
 */
export const signOut = () => ({
  type: types.USER_SIGNOUT,
});
