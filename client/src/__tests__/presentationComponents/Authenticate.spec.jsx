import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Authenticate from '../../components/presentation/Authenticate';
import '../../mockObjects/localStorage';

describe('The Authenticate component:', () => {
  const response = { status: 'successful' };
  const props = {
    history: { push: () => {} },
    signInUser: jest.fn(() => Promise.resolve(response)),
    signUserUp: jest.fn(() => Promise.resolve(response)),
    submitButton: 'submit',
    roleType: 'Learning',
    allDocuments: jest.fn(() => Promise.resolve(response)),
  };
  test('should render correctly', () => {
    const enzymeWrapper = mount(<Authenticate {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should show signup form when signupbtn is clicked',
    () => {
      const event = {
        preventDefault: () => 'Hello',
      };
      const enzymeWrapper = mount(<Authenticate {...props} />);
      enzymeWrapper.find('#authbuttons #signupbtn')
      .props().onClick(event);
      const component = enzymeWrapper;
      const tree = toJson(component);
      expect(tree).toMatchSnapshot();
    });

  test('should show signin form when signinbtn is clicked',
    () => {
      const event = {
        preventDefault: () => 'Hello',
      };
      const enzymeWrapper = mount(<Authenticate {...props} />);
      enzymeWrapper.find('#authbuttons #signinbtn')
      .props().onClick(event);
      const component = enzymeWrapper;
      const tree = toJson(component);
      expect(tree).toMatchSnapshot();
    });
});
