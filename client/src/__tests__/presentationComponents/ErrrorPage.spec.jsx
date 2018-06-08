import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ErrorPage from '../../components/presentation/ErrorPage';

describe('The ErrorPage component:', () => {
  const enzymeWrapper = shallow(<ErrorPage />);
  test('should render the ErrorPage component correctly', () => {
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
