import {
  createDoc, readDocument,
  fetchDocuments
} from '../reducers/documentReducers';
import * as types from '../actions/types';

describe('createDoc reducer function', () => {
  const initialState = {
    status: 'Unsuccessful',
    errors: [],
  };
  const action = {};

  test('Should return initial state when action is undefined', () => {
    expect(createDoc(undefined, action)).toEqual(initialState);
  });

  test('Should set status when create document operation starts', () => {
    action.type = types.START_CREATING_DOCUMENT;
    expect(createDoc(initialState, action).status).toBe('Creating document...');
  });

  test('Should set status when create document operation completes', () => {
    action.type = types.DONE_CREATING_DOCUMENT;
    expect(createDoc(initialState, action).status).toBe('Successful');
  });

  test(`Should set the right state values when error occurs
    while creating document`, () => {
    action.type = types.ERROR_CREATING_DOCUMENT;
    action.error = { message: '' };
    action.error.message = 'An error occured while creating document';
    expect(createDoc(initialState, action).status).toBe('Unsuccessful');
    expect(createDoc(initialState, action).errors)
        .toBe('An error occured while creating document');
  });
});

describe('readDocument reducer function', () => {
  const initialState = {
    status: 0,
    delStatus: 0,
    error: '',
    message: '',
    docStatus: 'submit',
    documentTitle: '',
    document: {},
  };
  const action = {};

  test('Should return initial state when action is undefined', () => {
    expect(readDocument(undefined, action)).toEqual(initialState);
  });

  test(`Should load up the state with a document to read
    when action type is `, () => {
    action.type = types.DONE_READING_DOCUMENT;
    action.document = {
      title: 'I love you',
      body: 'I need you',
      acess: 'Private'
    };
    expect(readDocument(initialState, action).documentTitle).toBe('I love you');
    expect(readDocument(initialState, action).document).toBe(action.document);
  });

  test('Should set the document id when starting to read a document', () => {
    action.type = types.START_READING_DOCUMENT;
    action.docId = 5;
    expect(readDocument(initialState, action).status).toBe(5);
    expect(readDocument(initialState, action).document).toBe('');
  });

  test(`Should set the document status correctly when 
    start-editing-document action type is dispatched`, () => {
    action.type = types.START_EDITING_DOCUMENT;
    expect(readDocument(initialState, action).docStatus).toBe('Editing');
  });

  test(`Should reassign the right state properties when editing
    is complete`, () => {
    action.type = types.DONE_EDITING_DOCUMENT;
    expect(readDocument(initialState, action).docStatus).toBe('submit');
  });

  test(`Should reassign the right state properties when editing
    is unsuccessful or an error was thrown`, () => {
    action.type = types.ERROR_EDITING_DOCUMENT;
    expect(readDocument(initialState, action).docStatus).toBe('submit');
  });

  test(`Should reassign the right state properties when editing
    is unsuccessful or an error was thrown`, () => {
    action.type = types.ERROR_EDITING_DOCUMENT;
    expect(readDocument(initialState, action).docStatus).toBe('submit');
  });

  test(`Should reassign the right state properties when updating
    the document title`, () => {
    action.type = types.UPDATE_TITLE;
    action.title = 'Should work';
    expect(readDocument(initialState, action).documentTitle)
        .toBe('Should work');
  });

  test(`Should reassign the right state properties when an
    error occured while reading a document`, () => {
    action.type = types.ERROR_READING_DOCUMENT;
    action.error = 'No roleId';
    expect(readDocument(initialState, action).error)
        .toBe('No roleId');
    expect(readDocument(initialState, action).error)
        .toBe('No roleId');
    expect(readDocument(initialState, action).document)
        .toEqual({});
  });
});

describe('fetchDocuments', () => {
  const initialState = {
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
  };
  const action = {};

  test('Should return initial state when action is undefined', () => {
    expect(fetchDocuments(undefined, action)).toEqual(initialState);
  });

  test(`Should reassign the right state properties when an
    delete process is complete`, () => {
    action.type = types.START_DELETING_DOCUMENT;
    action.docId = 5;
    expect(fetchDocuments(initialState, action).message)
        .toBe('');
    expect(fetchDocuments(initialState, action).delStatus)
        .toBe(5);
  });

  test('Should set the message property when deleting is complete', () => {
    action.type = types.DONE_DELETING_DOCUMENT;
    action.message = 'delete is complete';
    expect(fetchDocuments(initialState, action).message)
        .toBe('delete is complete');
  });

  test(`Should remove the deleted document from
    the state when delete is successful`, () => {
    action.type = types.DONE_DELETING_DOCUMENT;
    action.docId = 2;
    initialState.documents = [{ id: 1, title: 'hi' },
      { id: 2, title: 'hello' }];
    expect(fetchDocuments(initialState, action).documents.length)
        .toBe(1);
  });

  test(`Should set the error message in the state property
    an error occurred while deleting`, () => {
    action.type = types.ERROR_DELETING_DOCUMENT;
    action.error = 'Could not delete this document';
    expect(fetchDocuments(initialState, action).error)
        .toBe('Could not delete this document');
  });

  test(`Should set access property of the state to empty string
    when searching is complete without access property in the action`, () => {
    action.type = types.DONE_SEARCHING_DOCUMENTS;
    action.access = null;
    action.count = 2;
    action.pageNumber = 1;
    action.documents = [{ id: 1, title: 'hi' },
      { id: 2, title: 'hello' }];
    expect(fetchDocuments(initialState, action).isReady)
      .toBe(true);
    expect(fetchDocuments(initialState, action).documentaccess)
      .toBe('');
    expect(fetchDocuments(initialState, action).currentPage)
      .toBe(1);
    expect(fetchDocuments(initialState, action).documentCounter)
    .toBe(2);
  });

  test(`Should set the application state correctly
  when searching is complete`, () => {
    action.type = types.DONE_SEARCHING_DOCUMENTS;
    action.access = 'Public';
    action.count = 2;
    action.pageNumber = 1;
    action.documents = [{ id: 1, title: 'hi' },
      { id: 2, title: 'hello' }];
    expect(fetchDocuments(initialState, action).isReady)
      .toBe(true);
    expect(fetchDocuments(initialState, action).currentPage)
      .toBe(1);
    expect(fetchDocuments(initialState, action).documentCounter)
    .toBe(2);
  });

  test(`Should set the error message in the state property
    when an error occurred while searching`, () => {
    action.type = types.ERROR_SEARCHING_DOCUMENTS;
    action.error = 'Access denied';
    expect(fetchDocuments(initialState, action).status)
    .toBe('Access denied');
  });

  test(`Should set the status when starting to get
    user documents`, () => {
    action.type = types.START_GET_USER_DOCUMENT;
    expect(fetchDocuments(initialState, action).status)
        .toBe('Loading my documents...');
  });

  test(`Should set the application state correctly
    when fetching user documents is complete`, () => {
    action.type = types.SUCCESS_GET_USER_DOCUMENT;
    action.access = 'Public';
    action.count = 2;
    action.pageNumber = 1;
    action.documents = [{ id: 1, title: 'hi' },
      { id: 2, title: 'hello' }];
    expect(fetchDocuments(initialState, action).isReady)
      .toBe(true);
    expect(fetchDocuments(initialState, action).currentPage)
      .toBe(1);
    expect(fetchDocuments(initialState, action).documentaccess)
      .toBe('Private');
    expect(fetchDocuments(initialState, action).documents.length)
      .not.toBe(0);
    expect(fetchDocuments(initialState, action).documentCounter)
    .toBe(2);
  });

  test(`Should set the error message in the state property
    when an error occurred while fetching user documents`, () => {
    action.type = types.ERROR_GET_USER_DOCUMENT;
    const error = { message: 'Access denied' };
    action.error = error;
    expect(fetchDocuments(initialState, action).status)
    .toBe('Access denied');
    expect(fetchDocuments(initialState, action).isReady)
    .toBe(false);
  });

  test(`Should set the error message in the state property
    when an error occurred while fetching public documents`, () => {
    action.type = types.START_FETCHING_PUBLIC_DOCUMENTS;
    expect(fetchDocuments(initialState, action).status)
    .toBe('Loading public documents...');
    expect(fetchDocuments(initialState, action).isReady)
    .toBe(false);
  });

  test(`Should set the application state correctly
    when fetching public documents is complete`, () => {
    action.type = types.DONE_FETCHING_PUBLIC_DOCUMENTS;
    action.count = 2;
    action.documents = [{ id: 1, title: 'hi' },
      { id: 2, title: 'hello' }];
    expect(fetchDocuments(initialState, action).isReady)
      .toBe(true);
    expect(fetchDocuments(initialState, action).documentaccess)
      .toBe('Public');
    expect(fetchDocuments(initialState, action).documents.length)
      .not.toBe(0);
    expect(fetchDocuments(initialState, action).documentCounter)
    .toBe(2);
  });

  test(`Should set the error message in the state property
    when an error occurred while fetching public documents`, () => {
    action.type = types.ERROR_FETCHING_PUBLIC_DOCUMENTS;
    action.error = 'could not fetch documents';
    expect(fetchDocuments(initialState, action).status)
    .toBe('could not fetch documents');
    expect(fetchDocuments(initialState, action).isReady)
    .toBe(false);
  });

  test(`Should set the error message in the state property
    when an action to start fetching all documents is triggered`, () => {
    action.type = types.START_FETCHING_ALL_DOCUMENTS;
    action.error = 'could not fetch documents';
    expect(fetchDocuments(initialState, action).status)
    .toBe('Loading all documents...');
    expect(fetchDocuments(initialState, action).isReady)
    .toBe(false);
  });

  test(`Should set the application state correctly
    when fetching all documents is complete`, () => {
    action.type = types.DONE_FETCHING_ALL_DOCUMENTS;
    action.count = 2;
    action.documents = [{ id: 1, title: 'hi' },
      { id: 2, title: 'hello' }];
    expect(fetchDocuments(initialState, action).isReady)
      .toBe(true);
    expect(fetchDocuments(initialState, action).documentaccess)
      .toBe('All');
    expect(fetchDocuments(initialState, action).documents.length)
      .not.toBe(0);
    expect(fetchDocuments(initialState, action).documentCounter)
    .toBe(2);
  });

  test(`Should set the application state correctly
  when error occurred while fetching all documents`, () => {
    action.type = types.ERROR_FETCHING_ALL_DOCUMENTS;
    action.error = 'No document found';
    expect(fetchDocuments(initialState, action).isReady)
      .toBe(false);
    expect(fetchDocuments(initialState, action).documents.length)
      .toBe(0);
    expect(fetchDocuments(initialState, action).documentCounter)
    .toBe(0);
  });

  test(`Should set the error message in the state property
    when an error occurred while fetching all documents`, () => {
    action.type = types.ERROR_FETCHING_PUBLIC_DOCUMENTS;
    action.error = 'could not fetch all documents';
    expect(fetchDocuments(initialState, action).status)
    .toBe('could not fetch all documents');
    expect(fetchDocuments(initialState, action).isReady)
    .toBe(false);
    expect(fetchDocuments(initialState, action).documentCounter)
    .toBe(0);
  });

  test(`Should set the error message in the state property
    when an action to start fetching role documents is triggered`, () => {
    action.type = types.START_FETCHING_ROLE_DOCUMENTS;
    action.roleType = 'Learning';
    expect(fetchDocuments(initialState, action).status)
    .toBe('Learning');
    expect(fetchDocuments(initialState, action).isReady)
    .toBe(false);
  });

  test(`Should set the application state correctly
    when fetching Role based documents is complete`, () => {
    action.type = types.DONE_FETCHING_ROLE_DOCUMENTS;
    action.count = 2;
    action.roleType = 'Learning';
    action.documents = [{ id: 1, title: 'hi' },
      { id: 2, title: 'hello' }];
    expect(fetchDocuments(initialState, action).isReady)
      .toBe(true);
    expect(fetchDocuments(initialState, action).documentaccess)
      .toBe('Learning');
    expect(fetchDocuments(initialState, action).documents.length)
      .not.toBe(0);
    expect(fetchDocuments(initialState, action).documentCounter)
    .toBe(2);
  });

  test(`Should set the error message in the state property
    when an error occurred while fetching role based documents`, () => {
    action.type = types.ERROR_FETCHING_ROLE_DOCUMENTS;
    action.error = 'could not role all documents';
    expect(fetchDocuments(initialState, action).status)
    .toBe('could not role all documents');
    expect(fetchDocuments(initialState, action).isReady)
    .toBe(false);
    expect(fetchDocuments(initialState, action).documentCounter)
    .toBe(0);
  });
});
