import $ from 'jquery';
import axios from 'axios';
import * as types from './types';

export const startSignInUser = () => ({
  type: types.STARTSIGNIN,
});

export const finishSignInUser = userDetail => ({
  type: types.SUCCESSFULSIGNIN,
  userDetail,
});

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
  dispatch(errorSignInUser(response.data));
  return true;
});
};

export const startSignUpUser = () => ({
  type: types.STARTSIGNIN,
});

export const finishSignUpUser = userDetail => ({
  type: types.SUCCESSFULSIGNIN,
  userDetail,
});

export const errorSignUpUser = errors => ({
  type: types.FAILEDSIGNIN,
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
  dispatch(errorSignUpUser(response.data));
  return true;
});
};
