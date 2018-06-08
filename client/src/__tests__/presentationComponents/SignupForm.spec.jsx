import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import SignupForm from '../../components/presentation/SignupForm';

describe('The signupform component:', () => {
  const history = { push: url => url };
  const response = { status: 'successful' };
  const props = {
    signUserUp: jest.fn(() => Promise.resolve(response)),
    allDocuments: jest.fn(() => Promise.resolve()),
    submitButton: 'submit',
    roleType: 'Admin',
    history,
  };
  test('should render the signup form correctly', () => {
    const component = renderer.create(
      <SignupForm {...props} />
  );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test(`should submit the form to signup a user when signupbtn is clicked
  and the form is valid`, () => {
    const event = {
      preventDefault: () => 'hello',
    };
    const enzymeWrapper = mount(<SignupForm {...props} />);
    enzymeWrapper.find('button#signup').props().onClick(event);
    expect(props.signUserUp.mock.calls.length).toBe(1);
  });

  test('should alert an error message when signup fails', () => {
    response.status = 'unsuccessful';
    const event = {
      preventDefault: () => 'hello',
    };
    const enzymeWrapper = mount(<SignupForm {...props} />);
    enzymeWrapper.find('button#signup').props().onClick(event);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
