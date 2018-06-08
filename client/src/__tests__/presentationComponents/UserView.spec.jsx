import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import UserView from '../../components/presentation/UserView';
import '../../mockObjects/localStorage';

describe('The UserView component:', () => {
  let response = 'successful';
  const props = {
    userName: 'jackson',
    userId: 2,
    userEmail: 'jackson@gmail.com',
    updateStatus: 'updating',
    changeInputValue: jest.fn(),
    createdAt: 'sun june 3, 2013',
    roleType: 'Learning',
    editUserDetail: jest.fn(() => Promise.resolve(response)),
  };
  test('should render the userview component correctly', () => {
    const component = renderer.create(<UserView {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should fire changeInputValue when userEmail input text changes',
  () => {
    const enzymeWrapper = mount(<UserView {...props} />);
    enzymeWrapper.find('#userEmail').props().onChange();
    expect(props.changeInputValue.mock.calls.length).toBe(1);
  });

  test('should fire editUserDetail when submitting the changes',
  () => {
    const event = {
      preventDefault: () => 'hello',
    };
    const enzymeWrapper = mount(<UserView {...props} />);
    enzymeWrapper.find('#submitedit').props().onClick(event);
    expect(props.editUserDetail.mock.calls.length).toBe(1);
  });

  test('should alert error message when editing function fails',
  () => {
    const event = {
      preventDefault: () => 'hello',
    };
    response = 'unsuccessful';
    const enzymeWrapper = mount(<UserView {...props} />);
    enzymeWrapper.find('#submitedit').props().onClick(event);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should unhide the submit button when the edit button is clicked',
  () => {
    const event = {
      preventDefault: () => 'hello',
    };
    const enzymeWrapper = mount(<UserView {...props} />);
    enzymeWrapper.find('#editbtn').props().onClick(event);
    expect(enzymeWrapper.find('#editbtn').hasClass('hide')).toBe(false);
  });
});
