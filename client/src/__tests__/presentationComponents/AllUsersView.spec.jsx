import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import AllUsersView from '../../components/presentation/AllUsersView';
import '../../mockObjects/localStorage';

describe('The AllUsersView component:', () => {
  const response = { status: 'successful' };
  const props = {
    allUsers: [{ id: 1,
      username: 'jackson',
      email: 'jackson@gmail.com',
      roleId: 3,
      isactive: true,
      createdAt: Date(), }],
    responseStatus: 'successful',
    error: 'Access denied!',
    deactivateUser: jest.fn(() => Promise.resolve(response)),
    counter: 1,
    currentPage: 1,
    fetchAllUsers: jest.fn(() => Promise.resolve(response)),
  };
  test('should render correctly', () => {
    const enzymeWrapper = mount(<AllUsersView {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should render error message when responseStatus is unsuccessful',
  () => {
    props.responseStatus = 'unsuccessful';
    const enzymeWrapper = mount(<AllUsersView {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should render pagination link when counter is greater than 8',
  () => {
    props.counter = 9;
    const enzymeWrapper = mount(<AllUsersView {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should display roleType as SuperAdmin when roleId is 1',
  () => {
    props.allUsers[0].roleId = 1;
    const enzymeWrapper = mount(<AllUsersView {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should display roleType as Admin when roleId is 2',
  () => {
    props.allUsers[0].roleId = 2;
    const enzymeWrapper = mount(<AllUsersView {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should display roleType as Learning when roleId is 4',
  () => {
    props.allUsers[0].roleId = 4;
    const enzymeWrapper = mount(<AllUsersView {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should display roleType as Devops when roleId is 5',
  () => {
    props.allUsers[0].roleId = 5;
    const enzymeWrapper = mount(<AllUsersView {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should not display roleType when roleId is not btw 1 and 5 inclusive',
  () => {
    props.allUsers[0].roleId = 9;
    const enzymeWrapper = mount(<AllUsersView {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test('should button text to Activate when isactive prop is false',
  () => {
    props.allUsers[0].isactive = false;
    const enzymeWrapper = mount(<AllUsersView {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  // test('should ',
  //   () => {
  //     const enzymeWrapper = mount(<AllUsersView {...props} />);
  //     enzymeWrapper.find('Pagination')
  //     .props().onChange(2);
  //     const component = enzymeWrapper;
  //     const tree = toJson(component);
  //     expect(tree).toMatchSnapshot();
  //   });
});
