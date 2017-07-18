import axios from 'axios';
import * as types from './types';

/**
 * Dispatches an action when signin starts
 * @return {object} returns an object containing action type
 */
export const startSignInUser = () => ({
  type: types.STARTSIGNIN,
});
/**
 * Dispatches an action when signin completes successfully
 * @param {object} userDetail - User information from signin process
 * @return {object} returns an object containing user details and action type
 */
export const finishSignInUser = userDetail => ({
  type: types.SUCCESSFULSIGNIN,
  userDetail,
});
/**
 * Dispatches an action when signin error occurs
 * @param {object} errors - Errors from signin process
 * @return {object} returns an object containing errors and action type
 */
export const errorSignInUser = errors => ({
  type: types.FAILEDSIGNIN,
  errors,
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
    dispatch(finishSignInUser(response.data));
    localStorage.setItem('docmanagertoken', response.data.token);
  },
({ response }) => {
  dispatch(errorSignInUser(response.data.message));
  return true;
});
};
/**
 * Dispatches an action when signin starts
 * @return {object} returns an object containing action type
 */
export const startSignUpUser = () => ({
  type: types.STARTSIGNUP,
});
/**
 * Dispatches an action when signup completes successfully
 * @param {object} userDetail - User information from signup process
 * @return {object} returns an object containing user details and action type
 */
export const finishSignUpUser = userDetail => ({
  type: types.SUCCESSFULSIGNUP,
  userDetail,
});
/**
 * Dispatches an action when signup error occurs
 * @param {object} errors - Errors from signin process
 * @return {object} returns an object containing errors and action type
 */
export const errorSignUpUser = errors => ({
  type: types.FAILEDSIGNUP,
  errors,
});

/**
 * Dispatches an action to sign in a user
 * @param {object} user - Form data to send to the server
 * @return {func} returns a function that will be executed to signin a user
 */
export const signUpUser = user => (dispatch) => {
  dispatch(startSignUpUser());
  return axios.post('/api/v1/users', user)
  .then((response) => {
    dispatch(finishSignUpUser(response.data));
    localStorage.setItem('docmanagertoken', response.data.token);
  },
({ response }) => {
  dispatch(errorSignUpUser(response.data.message));
  return true;
});
};
