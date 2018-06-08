import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as documentAction from '../actions/documentActions';
import * as types from '../actions/types';
import '../mockObjects/localStorage';

describe('documentAction():', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());
  afterAll(() => {
    localStorage.clear();
  });

  test(`that startCreatingDocument function should return
    the correct action object`, () => {
    const actionObject = documentAction.startCreatingDocument();
    expect(actionObject).toEqual({
      type: types.START_CREATING_DOCUMENT,
    });
  });

  test(`that doneCreatingDocument function should return
    the correct action object`, () => {
    const actionObject = documentAction.doneCreatingDocument('ready');
    expect(actionObject).toEqual({
      type: types.DONE_CREATING_DOCUMENT,
      status: 'ready',
    });
    expect(actionObject.type).toBe(types.DONE_CREATING_DOCUMENT);
  });

  test(`that errorCreatingDocument function should return
    the correct action object`, () => {
    const actionObject = documentAction.errorCreatingDocument('Access denied');
    expect(actionObject).toEqual({
      type: types.ERROR_CREATING_DOCUMENT,
      error: 'Access denied',
    });
    expect(actionObject.type).toBe(types.ERROR_CREATING_DOCUMENT);
  });

  test('creates DONE_CREATING_DOCUMENT when signing up user has been done',
  () => {
    const formValue = { userId: 1,
      title: 'hello',
      body: 'Hie',
      access:
      'Pubic' };
    const response = {
      status: 'successful',
      message: 'No user found!' };
    moxios.stubRequest('/api/v1/documents', {
      status: 200,
      response,
    });

    const expectedActions = [
      { type: types.START_CREATING_DOCUMENT, },
      { type: types.DONE_CREATING_DOCUMENT,
        status: 'successful', },
    ];
    const store = mockStore({});
    store.dispatch(documentAction.documentCreation(formValue))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test('creates ERROR_CREATING_DOCUMENT when signing up user failed',
  () => {
    const formValue = { userId: 1,
      title: 'hello',
      body: 'Hie',
      access:
      'Pubic' };
    const response = {
      status: 'successful',
      message: 'No user found!' };
    moxios.stubRequest('/api/v1/documents', {
      status: 400,
      response,
    });

    const expectedActions = [
      { type: types.START_CREATING_DOCUMENT, },
      { type: types.ERROR_CREATING_DOCUMENT,
        error: 'No user found!', },
    ];
    const store = mockStore({});
    store.dispatch(documentAction.documentCreation(formValue))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test(`that startGetUserDocuments function should return
    the correct action object`, () => {
    const actionObject = documentAction.startGetUserDocuments();
    expect(actionObject).toEqual({
      type: types.START_GET_USER_DOCUMENT,
    });
  });

  test(`that completeGetUserDocuments function should return
    the correct action object`, () => {
    const documents = [{ id: 1, title: 'Fish bone' },
      { id: 2, title: 'Fish flesh' }];
    const actionObject = documentAction.completeGetUserDocuments(documents, 2);
    expect(actionObject.count).toBe(2);
    expect(actionObject.documents.length).not.toBe(0);
    expect(actionObject.type).toBe(types.SUCCESS_GET_USER_DOCUMENT);
  });

  test(`that errorGetUserDocuments function should return
    the correct action object`, () => {
    const actionObject = documentAction.errorGetUserDocuments('Access denied');
    expect(actionObject).toEqual({
      type: types.ERROR_GET_USER_DOCUMENT,
      error: 'Access denied',
    });
    expect(actionObject.type).toBe(types.ERROR_GET_USER_DOCUMENT);
  });

  it(`creates SUCCESS_GET_USER_DOCUMENT action when fetching
    user documents has been done`,
  () => {
    const formValue = { id: 1,
      userId: 1,
      title: 'hello',
      body: 'Hie',
      access:
      'Pubic' };
    const token = localStorage.getItem('docmanagertoken');
    const response = {
      status: 'successful',
      count: 1,
      documents: [formValue] };
    moxios
    .stubRequest(`/api/v1/users/1/documents?&offset=0&limit=8&token=${token}`,
      {
        status: 200,
        response,
      });

    const expectedActions = [
      { type: types.START_GET_USER_DOCUMENT, },
      { type: types.SUCCESS_GET_USER_DOCUMENT,
        documents: response.documents,
        count: response.count, },
    ];
    const store = mockStore({ documents: {} });
    store.dispatch(documentAction.getUserDocuments(formValue.userId))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it(`creates ERROR_GET_USER_DOCUMENT action when an error
  occured while fetching
  user documents`,
() => {
  const formValue = { id: 1,
    userId: 1,
    title: 'hello',
    body: 'Hie',
    access:
    'Pubic' };
  const token = localStorage.getItem('docmanagertoken');
  const response = {
    status: 'successful',
    message: 'error occurred!' };
  moxios
  .stubRequest(`/api/v1/users/1/documents?&offset=0&limit=8&token=${token}`,
    {
      status: 400,
      data: response,
    });

  const expectedActions = [
    { type: types.START_GET_USER_DOCUMENT, },
    { type: types.ERROR_GET_USER_DOCUMENT,
      error: response.data },
  ];
  const store = mockStore({ documents: {} });
  store.dispatch(documentAction.getUserDocuments(formValue.userId))
    .then(() => {
    // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
});

  test(`that fetchingPublicDocuments function should return
    the correct action object`, () => {
    const actionObject = documentAction.fetchingPublicDocuments();
    expect(actionObject).toEqual({
      type: types.START_FETCHING_PUBLIC_DOCUMENTS,
    });
  });

  test(`that fetchingPublicDocumentsComplete function should return
    the correct action object`, () => {
    const documents = [{ id: 1, title: 'Fish bone' },
      { id: 2, title: 'Fish flesh' }];
    const actionObject = documentAction
      .fetchingPublicDocumentsComplete(documents, 2);
    expect(actionObject.type).toEqual(types.DONE_FETCHING_PUBLIC_DOCUMENTS);
    expect(actionObject.count).toBe(2);
    expect(actionObject.documents.length).not.toBe(0);
  });

  test(`that fetchingPublicDocumentsFailed function should return
    the correct action object`, () => {
    const actionObject = documentAction
      .fetchingPublicDocumentsFailed('Access denied');
    expect(actionObject).toEqual({
      type: types.ERROR_FETCHING_PUBLIC_DOCUMENTS,
      error: 'Access denied',
    });
    expect(actionObject.type).toBe(types.ERROR_FETCHING_PUBLIC_DOCUMENTS);
  });

  it(`creates DONE_FETCHING_PUBLIC_DOCUMENTS when fetching
    public documents has been done`,
  (done) => {
    const formValue = { userId: 1,
      documentId: 2,
      title: 'hello',
      body: 'Hie',
      access:
      'Pubic' };
    const token = localStorage.getItem('docmanagertoken');
    const response = {
      status: 'successful',
      message: '',
      count: 1,
      documents: [formValue],
      curPage: 1,
      pageCount: 1,
      pageSize: 1, };
    moxios
    .stubRequest(`/api/v1/documents/Public?&offset=0&limit=8&token=${token}`,
      {
        status: 200,
        response,
      });

    const expectedActions = [
      { type: types.START_FETCHING_PUBLIC_DOCUMENTS, },
      { type: types.DONE_FETCHING_PUBLIC_DOCUMENTS,
        documents: [formValue],
        count: 1, },
    ];
    const store = mockStore({ documents: [] });
    store.dispatch(documentAction.publicDocuments())
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it(`creates ERROR_FETCHING_PUBLIC_DOCUMENTS when fetching
  public documents resulted in an error`,
(done) => {
  const token = localStorage.getItem('docmanagertoken');
  const response = {
    status: 'unsuccessful',
    message: '', };
  moxios
  .stubRequest(`/api/v1/documents/Public?&offset=0&limit=8&token=${token}`,
    {
      status: 400,
      response,
    });

  const expectedActions = [
    { type: types.START_FETCHING_PUBLIC_DOCUMENTS, },
    { type: types.ERROR_FETCHING_PUBLIC_DOCUMENTS,
      error: response.message },
  ];
  const store = mockStore({ documents: [] });
  store.dispatch(documentAction.publicDocuments())
    .then(() => {
    // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  done();
});

  test(`that fetchRoleDocuments function should return
    the correct action object`, () => {
    const actionObject = documentAction.fetchRoleDocuments('Learning');
    expect(actionObject).toEqual({
      type: types.START_FETCHING_ROLE_DOCUMENTS,
      roleType: 'Learning',
    });
    const actionObject1 = documentAction.fetchRoleDocuments();
    expect(actionObject1.roleType).toEqual('Loading...');
  });

  test(`that fetchRoleDocumentsComplete function should return
    the correct action object`, () => {
    const documents = [{ id: 1, title: 'Fish bone' },
      { id: 2, title: 'Fish flesh' }];
    const actionObject = documentAction
      .fetchRoleDocumentsComplete(documents, 2, 'Devops');
    expect(actionObject.type).toEqual(types.DONE_FETCHING_ROLE_DOCUMENTS);
    expect(actionObject.count).toBe(2);
    expect(actionObject.roleType).toBe('Devops');
    expect(actionObject.documents.length).not.toBe(0);
  });

  test(`that fetchRoleDocumentsFailed function should return
    the correct action object`, () => {
    const actionObject = documentAction
      .fetchRoleDocumentsFailed('Access denied');
    expect(actionObject).toEqual({
      type: types.ERROR_FETCHING_ROLE_DOCUMENTS,
      error: 'Access denied',
    });
    expect(actionObject.type).toBe(types.ERROR_FETCHING_ROLE_DOCUMENTS);
  });

  it(`creates DONE_FETCHING_ROLE_DOCUMENTS when fetching
    'Learning' documents has been done`,
  () => {
    const formValue = { userId: 1,
      id: 1,
      title: 'hello',
      body: 'Hie',
      access:
      'Pubic' };
    const roleType = 'Learning';
    const token = localStorage.getItem('docmanagertoken');
    const response = {
      count: 1,
      documents: [formValue], };
    moxios
    .stubRequest(`/api/v1/documents/${roleType}?&offset=0&limit=8&token=${token}`,
      {
        status: 200,
        response,
      });

    const expectedActions = [
      { type: types.START_FETCHING_ROLE_DOCUMENTS,
        roleType: 'Loading...', },
      { type: types.DONE_FETCHING_ROLE_DOCUMENTS,
        documents: response.documents,
        count: response.count,
        roleType: 'Learning' }
    ];
    const store = mockStore({ documents: [] });
    store.dispatch(documentAction.roleDocuments(roleType))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it(`creates ERROR_FETCHING_ROLE_DOCUMENTS when fetching
  'Learning' documents failed`,
() => {
  const roleType = 'Learning';
  const token = localStorage.getItem('docmanagertoken');
  const response = {
    message: 'an error occurred!' };
  moxios
  .stubRequest(`/api/v1/documents/${roleType}?&offset=0&limit=8&token=${token}`,
    {
      status: 400,
      response,
    });

  const expectedActions = [
    { type: types.START_FETCHING_ROLE_DOCUMENTS,
      roleType: 'Loading...', },
    { type: types.ERROR_FETCHING_ROLE_DOCUMENTS,
      error: response.message }
  ];
  const store = mockStore({ documents: [] });
  store.dispatch(documentAction.roleDocuments(roleType))
    .then(() => {
    // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
});

  test(`that fetchAllDocuments function should return
    the correct action object when fetching all documents`, () => {
    const actionObject = documentAction.fetchAllDocuments();
    expect(actionObject).toEqual({
      type: types.START_FETCHING_ALL_DOCUMENTS,
    });
  });

  test(`that fetchAllDocumentsComplete function should return
    the correct action object`, () => {
    const documents = [{ id: 1, title: 'Fish bone' },
      { id: 2, title: 'Fish flesh' }];
    const actionObject = documentAction
      .fetchAllDocumentsComplete(documents, 2);
    expect(actionObject.type).toEqual(types.DONE_FETCHING_ALL_DOCUMENTS);
    expect(actionObject.count).toBe(2);
    expect(actionObject.documents.length).not.toBe(0);
    expect(actionObject.documents[1].id).not.toBe(1);
  });

  test(`that fetchAllDocumentsFailed function should return
    the correct action object when there is failure`, () => {
    const actionObject = documentAction
      .fetchAllDocumentsFailed('Access denied');
    expect(actionObject).toEqual({
      type: types.ERROR_FETCHING_ALL_DOCUMENTS,
      error: 'Access denied',
    });
    expect(actionObject.type).toBe(types.ERROR_FETCHING_ALL_DOCUMENTS);
  });

  it(`creates DONE_FETCHING_ALL_DOCUMENTS when fetching
    all documents a user has access to has been done`,
  () => {
    const formValue = { userId: 1,
      documentId: 2,
      title: 'hello',
      body: 'Hie',
      access:
      'Pubic' };
    const token = localStorage.getItem('docmanagertoken');
    const response = {
      status: 'successful',
      count: 1,
      documents: [formValue] };
    moxios
      .stubRequest(`/api/v1/documents?&offset=0&limit=8&token=${token}`,
      {
        status: 200,
        response,
      });

    const expectedActions = [
      { type: types.START_FETCHING_ALL_DOCUMENTS, },
      { type: types.DONE_FETCHING_ALL_DOCUMENTS,
        documents: [formValue],
        count: 1, }
    ];
    const store = mockStore({ documents: [] });
    store.dispatch(documentAction.allDocuments('Learning'))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it(`creates DONE_FETCHING_ALL_DOCUMENTS when
  an Admin fetches all documents`,
() => {
  const formValue = { userId: 1,
    documentId: 2,
    title: 'hello',
    body: 'Hie',
    access:
    'Pubic' };
  const token = localStorage.getItem('docmanagertoken');
  const response = {
    status: 'successful',
    count: 1,
    documents: [formValue] };
  moxios
    .stubRequest(`/api/v1/documents?&offset=0&limit=8&token=${token}`,
    {
      status: 200,
      response,
    });

  const expectedActions = [
    { type: types.START_FETCHING_ALL_DOCUMENTS, },
    { type: types.DONE_FETCHING_ALL_DOCUMENTS,
      documents: [formValue],
      count: 1, }
  ];
  const store = mockStore({ documents: [] });
  store.dispatch(documentAction.allDocuments('Admin'))
    .then(() => {
    // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
});

  it(`creates ERROR_FETCHING_ALL_DOCUMENTS when error occurred while fetching
  all documents accessible to a user`,
  () => {
    const token = localStorage.getItem('docmanagertoken');
    const response = {
      message: 'An error occurred!' };
    moxios
      .stubRequest(`/api/v1/documents?&offset=0&limit=8&token=${token}`,
      {
        status: 400,
        data: response,
      });

    const expectedActions = [
      { type: types.START_FETCHING_ALL_DOCUMENTS, },
      { type: types.ERROR_FETCHING_ALL_DOCUMENTS,
        error: response.message }
    ];
    const store = mockStore({});
    store.dispatch(documentAction.allDocuments('Learning'))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test(`that readADocument function should return
    the correct action object`, () => {
    const actionObject = documentAction.readADocument(2);
    expect(actionObject).toEqual({
      type: types.START_READING_DOCUMENT,
      docId: 2,
    });
  });

  test(`that readDocumentComplete function should return
    the correct action object`, () => {
    const documents = [{ id: 1, title: 'Fish bone' },
      { id: 2, title: 'Fish flesh' }];
    const actionObject = documentAction
      .readDocumentComplete(documents);
    expect(actionObject.type).toEqual(types.DONE_READING_DOCUMENT);
    expect(actionObject.document.length).not.toBe(0);
    expect(actionObject.document[1].id).toBe(2);
  });

  test(`that readDocumentFailed function should return
    the correct action object`, () => {
    const actionObject = documentAction
      .readDocumentFailed('Access denied');
    expect(actionObject).toEqual({
      type: types.ERROR_READING_DOCUMENT,
      error: 'Access denied',
    });
    expect(actionObject.type).toBe(types.ERROR_READING_DOCUMENT);
  });

  it(`creates DONE_READING_DOCUMENT when reading
    a particular document a user has access to has been done`,
  () => {
    const formValue = { userId: 1,
      id: 2,
      title: 'hello',
      body: 'Hie',
      access:
      'Pubic' };
    const token = localStorage.getItem('docmanagertoken');
    const response = {
      status: 'successful',
      document: formValue,
      message: 'An error occurred while reading your document' };
    moxios
      .stubRequest(`/api/v1/document/2?offset=0&limit=8&token=${token}`,
      {
        status: 200,
        response,
      });

    const expectedActions = [
      { type: types.START_READING_DOCUMENT,
        docId: 2 },
      { type: types.DONE_READING_DOCUMENT,
        document: response.document, }
    ];
    const store = mockStore({ document: {} });
    store.dispatch(documentAction.readDocument(2))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it(`creates ERROR_READING_DOCUMENT when reading
  a particular document fails`,
() => {
  const token = localStorage.getItem('docmanagertoken');
  moxios
    .stubRequest(`/api/v1/document/2?offset=0&limit=8&token=${token}`,
    {
      status: 400,
      response: { message: 'Access denied!' },
    });

  const expectedActions = [
    { type: types.START_READING_DOCUMENT,
      docId: 2 },
    {
      type: types.ERROR_READING_DOCUMENT,
      error: 'Access denied!',
    }
  ];
  const store = mockStore({ document: {} });
  store.dispatch(documentAction.readDocument(2))
    .then(() => {
    // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
});

  test(`that setTitleInputValue function should return
    the correct action object`, () => {
    const actionObject = documentAction.setTitleInputValue('I love c#');
    expect(actionObject).toEqual({
      type: types.UPDATE_TITLE,
      title: 'I love c#',
    });
  });

  test(`creates UPDATE_TITLE when changing
  the title of a document`,
    () => {
      const expectedActions = [
        { type: types.UPDATE_TITLE,
          title: 'Hello', }
      ];
      const store = mockStore({});
      store.dispatch(documentAction
        .changeTitleValue('Hello'));
      expect(store.getActions()).toEqual(expectedActions);
    });

  test(`that startEditingDocument function should return
    the correct action object`, () => {
    const actionObject = documentAction.startEditingDocument();
    expect(actionObject).toEqual({
      type: types.START_EDITING_DOCUMENT,
    });
  });

  test(`that doneEditingDocument function should return
    the correct action object`, () => {
    const actionObject = documentAction
      .doneEditingDocument(2);
    expect(actionObject.type).toEqual(types.DONE_EDITING_DOCUMENT);
    expect(actionObject.documentId).toBe(2);
  });

  test(`that errorEditingDocument function should return
    the correct action object`, () => {
    const actionObject = documentAction
      .errorEditingDocument();
    expect(actionObject).toEqual({
      type: types.ERROR_EDITING_DOCUMENT,
    });
    expect(actionObject.type).toBe(types.ERROR_EDITING_DOCUMENT);
  });

  it(`creates DONE_EDITING_DOCUMENT when fetching
    all documents a user has access to has been done`,
  () => {
    const formValue = { userId: 1,
      documentId: 2,
      title: 'hello',
      body: 'Hie',
      access:
      'Pubic' };
    const token = localStorage.getItem('docmanagertoken');
    const response = {
      status: 'successful',
      count: 1,
      documents: [formValue] };
    moxios
      .stubRequest(`/api/v1/documents/2?token=${token}`,
      {
        status: 200,
        response,
      });

    const expectedActions = [
      { type: types.START_EDITING_DOCUMENT, },
      { type: types.DONE_EDITING_DOCUMENT,
        documentId: 2, }
    ];
    const store = mockStore({});
    store.dispatch(documentAction.editDocument(formValue, 2))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it(`creates ERROR_EDITING_DOCUMENT when fetching
  all documents a user has access to has been done`,
() => {
  const formValue = { userId: 1,
    documentId: 2,
    title: 'hello',
    body: 'Hie',
    access:
    'Pubic' };
  const token = localStorage.getItem('docmanagertoken');
  const response = {
    status: 'successful',
    count: 1,
    documents: [formValue] };
  moxios
    .stubRequest(`/api/v1/documents/2?token=${token}`,
    {
      status: 400,
      response,
    });

  const expectedActions = [
    { type: types.START_EDITING_DOCUMENT, },
    { type: types.ERROR_EDITING_DOCUMENT, }
  ];
  const store = mockStore({});
  store.dispatch(documentAction.editDocument(formValue, 2))
    .then(() => {
    // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
});

  test(`that deleteDocumentStart function should return
    the correct action object`, () => {
    const actionObject = documentAction.deleteDocumentStart(2);
    expect(actionObject).toEqual({
      type: types.START_DELETING_DOCUMENT,
      docId: 2,
    });
  });

  test(`that deleteDocumentComplete function should return
    the correct action object`, () => {
    const actionObject = documentAction.deleteDocumentComplete('successful', 2);
    expect(actionObject).toEqual({
      type: types.DONE_DELETING_DOCUMENT,
      docId: 2,
      message: 'successful',
    });
  });

  test(`that deleteDocumentFailed function should return
    the correct action object`, () => {
    const actionObject = documentAction.deleteDocumentFailed('Access denied!');
    expect(actionObject).toEqual({
      type: types.ERROR_DELETING_DOCUMENT,
      error: 'Access denied!',
    });
  });

  it('creates DONE_DELETING_DOCUMENT when deleting a document',
(done) => {
  const token = localStorage.getItem('docmanagertoken');
  const response = {
    message: 'delete successful', };
  moxios
    .stubRequest(`/api/v1/documents/2?&offset=0&limit=8&token=${token}`,
    {
      status: 200,
      response,
    });

  const expectedActions = [
    { type: types.START_DELETING_DOCUMENT,
      docId: 2, },
    { type: types.DONE_DELETING_DOCUMENT,
      message: response.message,
      docId: 2, }
  ];
  const store = mockStore({});
  store.dispatch(documentAction.deleteDocument(2))
    .then(() => {
    // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  done();
});

  test(`creates ERROR_DELETING_DOCUMENT when error occurred while
   deleting a document`,
(done) => {
  const token = localStorage.getItem('docmanagertoken');
  const response = {
    message: 'unsuccessful', };
  moxios
    .stubRequest(`/api/v1/documents/2?&offset=0&limit=8&token=${token}`,
    {
      status: 400,
      response,
    });

  const expectedActions = [
    { type: types.START_DELETING_DOCUMENT,
      docId: 2, },
    { type: types.ERROR_DELETING_DOCUMENT,
      error: response.message, }
  ];
  const store = mockStore({});
  store.dispatch(documentAction.deleteDocument(2))
    .then(() => {
    // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  done();
});

  test(`that doneSearchingDocuments function should return
    the correct action object`, () => {
    const documents = [{ id: 1, title: 'Fish bone' },
      { id: 2, title: 'Fish flesh' }];
    const actionObject = documentAction
      .doneSearchingDocuments(documents, 2, 1, 'Private');
    expect(actionObject).toEqual({
      type: types.DONE_SEARCHING_DOCUMENTS,
      documents,
      access: 'Private',
      pageNumber: 1,
      count: 2,
    });
  });

  test(`that errorSearchingDocuments function should return
    the correct action object`, () => {
    const actionObject = documentAction
      .errorSearchingDocuments('No result found!');
    expect(actionObject).toEqual({
      type: types.ERROR_SEARCHING_DOCUMENTS,
      error: 'No result found!',
    });
  });

  test(`creates DONE_SEARCHING_DOCUMENTS when searching for
  matched documents is complete`,
    (done) => {
      const token = localStorage.getItem('docmanagertoken');
      const url = '/api/v1/search/documents?';
      const response = {
        count: 1,
        documents: [{ userId: 1,
          title: 'Hi',
          body: 'Hello',
          access: 'Private' }],
        message: 'unsuccessful', };
      moxios
      .stubRequest(`${url}q=h&offset=0&limit=8&token=${token}`,
        {
          status: 200,
          data: response,
        });

      const expectedActions = [
        { type: types.DONE_SEARCHING_DOCUMENTS,
          documents: response.documents,
          count: response.count,
          pageNumber: 1,
          access: null }
      ];
      const store = mockStore({});
      store.dispatch(documentAction.searchDocuments('h'))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
      done();
    });

  test(`creates ERROR_SEARCHING_DOCUMENTS when searching for
    matched documents fail`,
      (done) => {
        const token = localStorage.getItem('docmanagertoken');
        const url = '/api/v1/search/documents?';
        const response = {
          message: 'unsuccessful', };
        moxios
        .stubRequest(`${url}q=h&offset=0&limit=8&token=${token}`,
          {
            status: 400,
            response,
          });

        const expectedActions = [
          { type: types.ERROR_SEARCHING_DOCUMENTS,
            error: response.message, }
        ];
        const store = mockStore({});
        store.dispatch(documentAction.searchDocuments('h'))
        .then(() => {
        // return of async actions
          expect(store.getActions()).toEqual(expectedActions);
        });
        done();
      });

  test(`that paginationUrl function should return
    the correct url link when access is Private`, () => {
    localStorage.setItem('docmanagertoken', 'hsiejsilelia');
    const actionObject = documentAction
      .paginationUrl('Private', 0, 2, 'Learning', 'Hi');
    expect(actionObject)
      .toBe('/api/v1/users/2/documents?&offset=0&limit=8&token=hsiejsilelia');
  });

  test(`that paginationUrl function should return
    the correct url link when access is Public`, () => {
    localStorage.setItem('docmanagertoken', 'hsiejsilelia');
    const actionObject = documentAction
      .paginationUrl('Public', 0, 2, 'Learning', 'Hi');
    expect(actionObject)
      .toBe('/api/v1/documents/Public?&offset=0&limit=8&token=hsiejsilelia');
  });

  test(`that paginationUrl function should return
    the correct url link when access is Admin`, () => {
    localStorage.setItem('docmanagertoken', 'hsiejsilelia');
    const actionObject = documentAction
      .paginationUrl('Admin', 0, 2, 'Admin', 'Hi');
    expect(actionObject)
      .toBe('/api/v1/documents/Admin?&offset=0&limit=8&token=hsiejsilelia');
  });

  test(`that paginationUrl function should return
    the correct url link when access is Public`, () => {
    localStorage.setItem('docmanagertoken', 'hsiejsilelia');
    const actionObject = documentAction
      .paginationUrl('Learning', 0, 2, 'Learning', 'Hi');
    expect(actionObject)
      .toBe('/api/v1/documents/Learning?&offset=0&limit=8&token=hsiejsilelia');
  });

  test(`that paginationUrl function should return
    the correct url link when access is Public`, () => {
    localStorage.setItem('docmanagertoken', 'hsiejsilelia');
    const actionObject = documentAction
      .paginationUrl('Devops', 0, 2, 'Devops', 'Hi');
    expect(actionObject)
      .toBe('/api/v1/documents/Devops?&offset=0&limit=8&token=hsiejsilelia');
  });

  test(`that paginationUrl function should return
    the correct url link when access is All`, () => {
    localStorage.setItem('docmanagertoken', 'hsiejsilelia');
    const actionObject = documentAction
      .paginationUrl('All', 0, 2, 'All', 'Hi');
    expect(actionObject)
      .toBe('/api/v1/documents/All?&offset=0&limit=8&token=hsiejsilelia');
    const actionObject1 = documentAction
      .paginationUrl('All', 0, 2, 'Admin', 'Hi');
    expect(actionObject1)
      .toBe('/api/v1/documents?&offset=0&limit=8&token=hsiejsilelia');
  });

  test(`that paginationUrl function should return
    the correct url link when access is not set`, () => {
    localStorage.setItem('docmanagertoken', 'hsiejsilelia');
    const actionObject = documentAction
      .paginationUrl('', 0, 2, 'Devops', 'Hi');
    expect(actionObject)
    .toBe('/api/v1/search/documents?q=Hi&offset=0&limit=8&token=hsiejsilelia');
  });

  test(`creates DONE_SEARCHING_DOCUMENTS when paginating
  after fetching documents`,
    (done) => {
      const url = documentAction.paginationUrl('Pubic', 1, 1, 'Learning', 'Hi');
      const response = {
        documents: [{ usesId: 1,
          title: 'Hello',
          body: 'Hi',
          access: 'Public' }],
        count: 1,
        message: 'unsuccessful', };
      moxios
      .stubRequest(url,
        {
          status: 200,
          data: response,
        });

      const expectedActions = [
        { type: types.DONE_SEARCHING_DOCUMENTS,
          documents: response.documents,
          count: response.count,
          pageNumber: 1,
          access: response.access }
      ];
      const store = mockStore({});
      store.dispatch(documentAction
        .paginateDocument(1, 1, 'Pubic', 'Hi', 'Learning', 1))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
      done();
    });

  test(`creates ERROR_SEARCHING_DOCUMENTS when error occurre
    while paginating fetched documents`,
      (done) => {
        const url = documentAction
        .paginationUrl('Pubic', 1, 1, 'Learning', 'Hi');
        const response = {
          message: 'unsuccessful', };
        moxios
        .stubRequest(url,
          {
            status: 400,
            response,
          });

        const expectedActions = [
          { type: types.ERROR_SEARCHING_DOCUMENTS,
            error: response.message }
        ];
        const store = mockStore({});
        store.dispatch(documentAction
          .paginateDocument(1, 1, 'Pubic', 'Hi', 'Learning', 1))
        .then(() => {
        // return of async actions
          expect(store.getActions()).toEqual(expectedActions);
        });
        done();
      });
});
