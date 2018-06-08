import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { DocumentPreview,
    getDocument } from '../../components/presentation/DocumentPreview';
import '../../mockObjects/localStorage';

describe('The DocumentPreview component:', () => {
  const event = {
    preventDefault: () => 'hello',
  };
  const response = { status: 'successful' };
  const props = {
    userDocuments: [{
      title: 'jackson goes to school',
      body: 'jackson goes to church',
      id: 1,
      userId: 2,
    }],
    readDocument: jest.fn(() => Promise.resolve(response)),
    read: 1,
    deleteId: 1,
    history: { push: jest.fn() },
    deleteDocument: jest.fn(() => Promise.resolve()),
    paginateDocument: jest.fn(() => Promise.resolve()),
    documentAccess: 'Admin',
    currentPage: 1,
    documentsCount: 1,
    roleType: 'Learning',
    userId: 1,
  };
  test('should render the DocumentPreview component correctly', () => {
    const enzymeWrapper = shallow(<DocumentPreview {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test(`should render the delete button when previewing documents
  created created by me`, () => {
    props.userId = 2;
    const enzymeWrapper = shallow(<DocumentPreview {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test(`should render pagination links in DocumentPreview component when
  document count is greater than 8`, () => {
    props.documentsCount = 9;
    const enzymeWrapper = shallow(<DocumentPreview {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should fire open a document to read when read button is clicked',
    () => {
      const enzymeWrapper = shallow(<DocumentPreview {...props} />);
      enzymeWrapper.find('button[name="read-doc"]').props().onClick(event);
      expect(props.readDocument.mock.calls.length).toBe(1);
    });

  test('should set the read button text to "opening" when documentid = read',
    () => {
      const enzymeWrapper = shallow(<DocumentPreview {...props} />);
      expect(enzymeWrapper.find('button[name="read-doc"]')
      .text()).toBe('Opening ');
    });

  test('should set read button text to Read when document id !== read',
    () => {
      props.read = 2;
      const enzymeWrapper = shallow(<DocumentPreview {...props} />);
      expect(enzymeWrapper.find('button[name="read-doc"]')
      .text()).toBe('Read ');
    });

  test(`should set delete button text to deleting
    when deleteid === document id`,
    () => {
      const enzymeWrapper = shallow(<DocumentPreview {...props} />);
      expect(enzymeWrapper.find('button[name="delete-doc"]')
      .text()).toBe('Deleting ');
    });

  test(`should set delete button text to delete
    when deleteid !== document id`,
    () => {
      props.deleteId = 5;
      const enzymeWrapper = shallow(<DocumentPreview {...props} />);
      expect(enzymeWrapper.find('button[name="delete-doc"]')
      .text()).toBe('Delete ');
    });

  test('should opening a document when button[name="read-doc"] is clicked',
    () => {
      const enzymeWrapper = shallow(<DocumentPreview {...props} />);
      enzymeWrapper.find('button[name="read-doc"]').props().onClick(event);
      expect(props.readDocument.mock.calls.length).toBe(2);
    });

  test(`should show error message when button[name="read-doc"] is clicked
  and an error occurred`,
    () => {
      response.status = 'unsuccessful';
      const enzymeWrapper = shallow(<DocumentPreview {...props} />);
      enzymeWrapper.find('button[name="read-doc"]').props().onClick(event);
      const component = enzymeWrapper;
      const tree = toJson(component);
      expect(tree).toMatchSnapshot();
    });

  test(`should successfully delete a documen when 
  button[name="delete-doc"] is clicked`,
    () => {
      const enzymeWrapper = shallow(<DocumentPreview {...props} />);
      enzymeWrapper.find('button[name="delete-doc"]').props().onClick(event);
      expect(props.deleteDocument.mock.calls.length).toBe(0);
    });

  test('should paginate documents after fetching documents is initiated',
    () => {
      getDocument(1, props.paginateDocument, 'Learning', 'Learning', 1);
      expect(props.paginateDocument.mock.calls.length).toBe(1);
    });
});
