import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import DocumentView from '../../components/presentation/DocumentView';

describe('The DocumentView component:', () => {
  const props = {
    documents: [{ title: 'jackson goes to school',
      body: 'jackson goes to church',
      id: 1 }],
    shouldDisplay: true,
    read: 1,
    deleteId: 1,
    documentStatus: 'No document found!',
    readDocument: jest.fn(() => Promise.resolve()),
    history: { push: jest.fn() },
    deleteDocument: jest.fn(() => Promise.resolve()),
    paginateDocument: jest.fn(() => Promise.resolve()),
    documentAccess: 'Admin',
    currentPage: 1,
    documentsCount: 1,
    roleType: 'Learning',
    id: 1,
  };
  test('should render the DocumentView component correctly', () => {
    const enzymeWrapper = shallow(<DocumentView {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should render an error message when shoulddisplay is false', () => {
    props.shouldDisplay = false;
    const enzymeWrapper = shallow(<DocumentView {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
