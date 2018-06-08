'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mockUsers = [{
  username: 'james',
  email: 'james@gmail.com',
  password: 'testing1',
  roleId: 5,
  isactive: true
}, {
  username: 'john',
  email: 'john@gmail.com',
  password: 'testing1',
  roleId: 3,
  isactive: true
}, {
  username: 'paul',
  email: 'paul@gmail.com',
  password: 'testing1',
  roleId: 4,
  isactive: true
}, {
  username: 'peterson',
  email: 'peter@gmail.com',
  password: 'testing1',
  roleId: 3,
  isactive: true
}, {
  username: 'prince',
  email: 'prince@gmail.com',
  password: 'testing1',
  roleId: 3,
  isactive: true
}, {
  username: 'matthew',
  email: 'matthew@gmail.com',
  password: 'testing1',
  roleId: 3,
  isactive: true
}];

var superAdmin = exports.superAdmin = {
  userName: 'SuperAdmin',
  password: 'testing1'
};

var testUser = exports.testUser = {
  userName: 'jackson',
  email: 'jackson@gmail.com',
  password: 'testing1',
  roleId: 3,
  isactive: true
};

var testUser1 = exports.testUser1 = {
  userName: 'janet',
  email: 'janet@gmail.com',
  password: 'testing1',
  roleId: 4,
  isactive: true
};

var admin = exports.admin = {
  userName: 'touchstone',
  password: 'testing1'
};

exports.default = mockUsers;