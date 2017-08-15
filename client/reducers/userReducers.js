import * as types from '../actions/types';

/**
 * Manages actions that controls user authentication
 * @param {object} state - The redux state of the application
 * that manages authentication
 * @param {object} action - The dispatched action from redux
 * action creators
 * @return {object} returns the updated state of the application
 */
export const authenticateUser = (state = {
  userId: 0,
  updateStatus: 'Update Profile',
  disabled: true,
  authButtonStatus: 'Submit',
  signUpDate: '',
  userName: 'Guest',
  userEmail: '',
  updateEmail: '',
  errors: [],
  roleType: 'None',
  status: 'unsuccessful',
}, action) => {
  switch (action.type) {
  case types.START_UPDATING_USER:
    return Object.assign({}, state, {
      updateStatus: 'Updating...',
    });
  case types.UPDATE_EMAIL:
    return Object.assign({}, state, {
      updateEmail: action.email,
    });
  case types.DONE_UPDATING_USER:
    return Object.assign({}, state, {
      updateStatus: 'Update Profile',
    });
  case types.ERROR_UPDATING_USER:
    return Object.assign({}, state, {
      updateStatus: 'Update Profile',
    });
  case types.START_SIGNUP:
    return Object.assign({}, state, {
      signUpStatus: 'Submiting...',
    });
  case types.SUCCESSFUL_SIGNUP:
    return Object.assign({}, state, {
      authButtonStatus: 'Submit',
      userName: action.userDetail.userName || 'Guest',
      userId: action.userDetail.userId || 0,
      userEmail: action.userDetail.email,
      updateEmail: action.userDetail.email,
      roleType: action.userDetail.roleType,
      createdAt: action.userDetail.createdAt,
      status: 'successful',
      errors: [],
    });
  case types.FAILED_SIGNUP:
    return Object.assign({}, state, {
      authButtonStatus: 'Submit',
      errors: action.errors,
      status: 'unsuccessful',
    });
  case types.SET_USER_ROLE:
    return Object.assign({}, state, {
      roleType: action.userRole,
    });

  case types.START_SIGNIN:
    return Object.assign({}, state, {
      authButtonStatus: 'Submitting...',
      status: 'unsuccessful',
    });
  case types.SUCCESSFUL_SIGNIN:
    return Object.assign({}, state, {
      authButtonStatus: 'Submit',
      userName: action.userDetail.userName || 'Guest',
      userId: action.userDetail.userId || 0,
      userEmail: action.userDetail.email,
      updateEmail: action.userDetail.email,
      createdAt: action.userDetail.createdAt,
      roleType: action.userDetail.roleType,
      status: 'successful',
      errors: [],
    });
  case types.FAILED_SIGNIN:
    return Object.assign({}, state, {
      authButtonStatus: 'Submit',
      errors: action.errors,
      status: 'unsuccessful',
    });
  default:
    return state;
  }
};

/**
 * Manages actions that controls fetching all users from storage
 * @param {object} state - The redux state of the application
 * that manages authentication
 * @param {object} action - The dispatched action from redux
 * action creators
 * @return {object} returns the updated state of the application
 */
export const fetchAllUsers = (state = {
  status: '',
  responseStatus: '',
  users: [],
  counter: 0,
  currentPage: 1,
}, action) => {
  switch (action.type) {
  case types.START_GETTING_ALL_USERS:
    return Object.assign({}, state, {
      status: 'Fetching all users...',
      responseStatus: '',
    });
  case types.ERROR_GETTING_ALL_USERS:
    return Object.assign({}, state, {
      status: action.error,
      responseStatus: action.responseStatus,
    });
  case types.FINISH_GETTING_ALL_USERS:
    return Object.assign({}, state, {
      users: action.users,
      status: '',
      currentPage: action.pageNumber || 1,
      counter: action.count,
      responseStatus: action.responseStatus,
    });
  case types.DONE_DEACTIVATING_USER:
    return Object.assign({}, state, {
      users: state.users.map((user) => {
        if (user.id === action.userId) {
          user.isactive = !user.isactive;
        }
        return user;
      }),
    });
  default:
    return state;
  }
};

/**
 * Manages actions that controls user deactivation
 * @param {object} state - The redux state of the application
 * that manages authentication
 * @param {object} action - The dispatched action from redux
 * action creators
 * @return {object} returns the updated state of the application
 */
export const deactivateUser = (state = {
  status: 'Activate',
  deactivatedId: 0,
}, action) => {
  switch (action.type) {
  case types.ERROR_DEACTIVATING_USER:
    return Object.assign({}, state, {
      deactivatedId: 0,
    });
  case types.DONE_DEACTIVATING_USER:
    return Object.assign({}, state, {
      deactivatedId: action.userId,
    });
  default:
    return state;
  }
};
