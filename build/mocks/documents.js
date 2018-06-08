'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mockDocuments = [{
  title: 'Test spec document 0',
  body: 'This isdof lsldifi should find a given document griea',
  access: 'Private'
}, {
  title: 'Test spec document 1',
  body: 'This isdof lsldifi should find a given document griea',
  access: 'Public'
}, {
  title: 'Test spec document 2',
  body: 'This isdof what the man said on friday hadlf if griea',
  access: 'Private'
}, {
  title: 'Test subordinate document 3',
  body: 'This isdof which is why adhfkdff hadlf if yowf aleri griea',
  access: 'Fellow'
}, {
  title: 'Test spec document 4',
  body: 'This isdof griea',
  access: 'Devops'
}, {
  title: 'Test main document 5',
  body: 'The name of my friend is great and cool',
  access: 'Devops'
}, {
  title: 'Test runing document 6',
  body: 'The name of my friend!',
  access: 'Learning'
}];

var adminDocument = exports.adminDocument = {
  title: 'Admin Document',
  body: 'This document belongs to an admin',
  access: 'Private'
};

exports.default = mockDocuments;