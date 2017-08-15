import { authenticateUser, fetchAllUsers,
  deactivateUser } from '../reducers/userReducers';
import * as types from '../actions/types';

// Reducers for user operations
describe('userReducers()', () => {
  const initialState = {
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
  };
  const action = {

  };
  const userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    userId: 10,
    roleType: 'Learning',
    status: 'successful',
    errors: [],
    updateEmail: 'jackson@gmail.com',
  };

  test('should return the default state', () => {
    expect(authenticateUser(undefined, action)).toEqual(initialState);
    expect(authenticateUser(initialState, action).errors).toEqual([]);
  });

  test('should fire the right action', () => {
    action.type = types.START_UPDATING_USER;
    expect(authenticateUser(initialState, action).updateStatus)
      .toBe('Updating...');
  });

  test('should fire the right action', () => {
    action.type = types.UPDATE_EMAIL;
    action.email = 'touchstone@gmail.com';
    expect(authenticateUser(initialState, action).updateEmail)
      .toBe('touchstone@gmail.com');
    expect(authenticateUser(initialState, action).updateStatus)
      .toBe('Update Profile');
  });

  test('should reset the update status when update process is done', () => {
    action.type = types.DONE_UPDATING_USER;
    expect(authenticateUser(initialState, action).updateStatus)
      .toBe('Update Profile');
  });

  test('should reset the update status when update process is done', () => {
    action.type = types.ERROR_UPDATING_USER;
    expect(authenticateUser(initialState, action).updateStatus)
      .toBe('Update Profile');
  });

  test('should change status to submitting when signup starts', () => {
    action.type = types.START_SIGNUP;
    expect(authenticateUser(initialState, action).signUpStatus)
      .toBe('Submiting...');
  });

  test(`should save the userName prop of state
    to jackson when signup completes`, () => {
    action.type = types.SUCCESSFUL_SIGNUP;
    action.userDetail = userDetail;
    expect(authenticateUser(initialState, action).userName).toBe('jackson');
    expect(authenticateUser(initialState, action).userEmail)
        .toBe('jackson@gmail.com');
    expect(authenticateUser(initialState, action).updateStatus)
        .not.toBe('Updating...');
  });

  test('should set the roleType of the user at signup', () => {
    action.type = types.SUCCESSFUL_SIGNUP;
    action.userDetail = userDetail;
    expect(authenticateUser(initialState, action).roleType).toBe('Learning');
  });
  test('There should be no errors after successful signup', () => {
    action.type = types.SUCCESSFUL_SIGNUP;
    action.userDetail = userDetail;
    expect(authenticateUser(initialState, action).errors).toEqual([]);
    expect(authenticateUser(initialState, action).status).toBe('successful');
  });

  test(`Should set userName to guest when signup is successful and
  no username in the action created`, () => {
    action.type = types.SUCCESSFUL_SIGNUP;
    userDetail.roleType = 'Fellow';
    userDetail.userName = null;
    userDetail.userId = null;
    action.userDetail = userDetail;
    expect(authenticateUser(initialState, action).userName).toBe('Guest');
    expect(authenticateUser(initialState, action).userId).toBe(0);
    expect(authenticateUser(initialState, action).errors).toEqual([]);
    expect(authenticateUser(initialState, action).roleType).toBe('Fellow');
  });

  test('There should be an error message after signup fails', () => {
    action.type = types.FAILED_SIGNUP;
    action.errors = ['Wrong username', 'Wrong password'];
    expect(authenticateUser(initialState, action).errors)
      .toEqual(['Wrong username', 'Wrong password']);
    expect(authenticateUser(initialState, action).status).toBe('unsuccessful');
  });

  test('Should set the userRole when SET_USER_ROLE is dispatched', () => {
    action.type = types.SET_USER_ROLE;
    action.userRole = 'Devops';
    expect(authenticateUser(initialState, action).roleType)
      .toBe('Devops');
    expect(authenticateUser(initialState, action).status).toBe('unsuccessful');
    expect(authenticateUser(initialState, action).userName).toBe('Guest');
  });

  test(`should change authButtonStatus value
    when signin operation starts`, () => {
    action.type = types.START_SIGNIN;
    expect(authenticateUser(initialState, action).authButtonStatus)
        .toBe('Submitting...');
    expect(authenticateUser(initialState, action).status).toBe('unsuccessful');
  });

  test('Should set userID when signin is successful', () => {
    action.type = types.SUCCESSFUL_SIGNIN;
    userDetail.userName = 'jackson';
    userDetail.userId = 10;
    action.userDetail = userDetail;
    action.userDetail.roleType = 'Fellow';
    expect(authenticateUser(initialState, action).authButtonStatus)
      .not.toBe('Submitting...');
    expect(authenticateUser(initialState, action).userName).toBe('jackson');
    expect(authenticateUser(initialState, action).userId).toBe(10);
    expect(authenticateUser(initialState, action).roleType).toBe('Fellow');
  });

  test(`Should set userName to guest when signin is successful and
  no username in the action created`, () => {
    action.type = types.SUCCESSFUL_SIGNIN;
    userDetail.userName = null;
    userDetail.userId = null;
    action.userDetail = userDetail;
    action.userDetail.roleType = 'Fellow';
    expect(authenticateUser(initialState, action).authButtonStatus)
      .not.toBe('Submitting...');
    expect(authenticateUser(initialState, action).userName).toBe('Guest');
    expect(authenticateUser(initialState, action).userId).toBe(0);
    expect(authenticateUser(initialState, action).roleType).toBe('Fellow');
  });

  test('Should capture error when signin fails', () => {
    action.type = types.FAILED_SIGNIN;
    action.errors = ['Wrong password'];
    expect(authenticateUser(initialState, action).authButtonStatus)
      .not.toBe('Submitting...');
    expect(authenticateUser(initialState, action).errors.length)
      .toBeGreaterThan(0);
  });
});

describe('fetchAllUsers', () => {
  const initialState = {
    status: '',
    responseStatus: '',
    users: [],
    counter: 0,
    currentPage: 1,
  };
  const action = {

  };

  test('Should return initial state when there is no action', () => {
    expect(fetchAllUsers(undefined, action)).toEqual(initialState);
  });

  test('should updates status when fetching all users operation starts', () => {
    action.type = types.START_GETTING_ALL_USERS;
    expect(fetchAllUsers(initialState, action).status)
      .toBe('Fetching all users...');
    expect(fetchAllUsers(initialState, action).responseStatus)
      .toBe('');
    expect(fetchAllUsers(initialState, action).counter)
      .toBe(0);
    expect(fetchAllUsers(initialState, action).currentPage)
      .toBe(1);
  });

  test(`should return an object with error message set when
    error occurs while fetching all users`, () => {
    action.type = types.ERROR_GETTING_ALL_USERS;
    action.responseStatus = 'unsuccessful';
    action.error = 'could not get all users!';
    expect(fetchAllUsers(initialState, action).status)
        .toBe('could not get all users!');
    expect(fetchAllUsers(initialState, action).responseStatus)
        .toBe('unsuccessful');
    expect(fetchAllUsers(initialState, action).counter)
        .toBe(0);
    expect(fetchAllUsers(initialState, action).currentPage)
        .toBe(1);
  });

  test(`should save all users in the users array of the state when
    get user operation is successful`, () => {
    action.type = types.FINISH_GETTING_ALL_USERS;
    action.responseStatus = 'successful';
    action.pageNumber = 3;
    action.count = 2;
    action.users = [{ username: 'jackson',
      id: 1,
      isactive: true, }, {
        username: 'anthony',
        id: 2,
        isactive: true,
      }];
    expect(fetchAllUsers(initialState, action).status)
        .not.toBe('could not get all users!');
    expect(fetchAllUsers(initialState, action).responseStatus)
        .toBe('successful');
    expect(fetchAllUsers(initialState, action).counter)
        .toBe(2);
    expect(fetchAllUsers(initialState, action).currentPage)
        .toBe(3);
    expect(fetchAllUsers(initialState, action).users.length)
        .toBe(2);
    action.pageNumber = null;
    expect(fetchAllUsers(initialState, action).currentPage)
    .toBe(1);
  });

  test(`should not change the isactive prop of a user
    that wasn't deactivated`, () => {
    initialState.users = [{ username: 'jackson',
      id: 1,
      isactive: true, }];
    action.type = types.DONE_DEACTIVATING_USER;
    action.userId = 2;
    expect(fetchAllUsers(initialState, action).users[0].isactive)
        .toBe(true);
  });

  test(`should change the isactive prop of a user
  that was deactivated`, () => {
    initialState.users = [{ username: 'jackson',
      id: 1,
      isactive: true, }];
    action.type = types.DONE_DEACTIVATING_USER;
    action.userId = 1;
    expect(fetchAllUsers(initialState, action).users[0].isactive)
        .toBe(false);
  });
});

describe('deactivateUser', () => {
  const initialState = {
    status: 'Activate',
    deactivatedId: 0,
  };
  const action = {

  };

  test('Should return default state when no action is fired', () => {
    expect(deactivateUser(undefined, action)).toEqual(initialState);
  });

  test('Should set deactivatedId to 0 when error occurred deactivating user',
  () => {
    action.type = types.ERROR_DEACTIVATING_USER;
    expect(deactivateUser(initialState, action).deactivatedId).toBe(0);
  });

  test(`Should set the deactivatedId to the userId from action object
    when deactivating user was successful`, () => {
    action.type = types.DONE_DEACTIVATING_USER;
    action.userId = 2;
    expect(deactivateUser(initialState, action).deactivatedId).toBe(2);
  });
});
