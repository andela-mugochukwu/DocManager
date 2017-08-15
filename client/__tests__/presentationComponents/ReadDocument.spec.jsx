import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ReadDocument from '../../components/presentation/ReadDocument';

describe('The ReadDocument component:', () => {
  const event = {
    preventDefault: () => 'hello',
  };
  const response = { status: 'successful' };
  const props = {
    documentTitle: 'jackson goes to school',
    body: 'I have a friend whose name is jackson',
    author: 'jackson',
    modifiedDate: 'june 20, 2010',
    history: { push: jest.fn() },
    changeTitleValue: jest.fn(),
    editDocument: jest.fn(() => Promise.resolve(response)),
    documentId: 1,
    docStatus: 'successful',
    userId: 5,
    roleType: 'Learning',
    ownerId: 5,
  };
  test('should render the ReadDocument component correctly', () => {
    const enzymeWrapper = shallow(<ReadDocument {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should fire changeTitleValue when #title input text changes',
    () => {
      const enzymeWrapper = shallow(<ReadDocument {...props} />);
      enzymeWrapper.find('#readdocument #title').props().onChange();
      expect(props.changeTitleValue.mock.calls.length).toBe(1);
    });

  test('should display form elements to edit the documents',
    () => {
      const enzymeWrapper = shallow(<ReadDocument {...props} />);
      enzymeWrapper.find('#editbtn').props().onClick(event);
      expect(enzymeWrapper.find('#docbody').hasClass('hide')).toBe(false);
      expect(enzymeWrapper.find('#docbodyedit').hasClass('hide')).toBe(true);
      expect(enzymeWrapper.find('#submitbtn').hasClass('hide')).toBe(true);
    });

  test('should call processEdit editDocument',
    () => {
      const enzymeWrapper = shallow(<ReadDocument {...props} />);
      enzymeWrapper.find('#submitbtn').props().onClick(event);
      expect(props.editDocument.mock.calls.length).toBe(2);
    });

  test('should alert error message when editing document fails', () => {
    response.status = 'unsuccessful';
    const enzymeWrapper = shallow(<ReadDocument {...props} />);
    enzymeWrapper.find('#submitbtn').props().onClick(event);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should display edit button when roleType is admin', () => {
    props.userId = 1;
    props.roleType = 'Admin';
    const enzymeWrapper = shallow(<ReadDocument {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should display edit button when roleType is superadmin', () => {
    props.roleType = 'SuperAdmin';
    const enzymeWrapper = shallow(<ReadDocument {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should display not edit button when roleType is Learning', () => {
    props.roleType = 'Learning';
    const enzymeWrapper = shallow(<ReadDocument {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
