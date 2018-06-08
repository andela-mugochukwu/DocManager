import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Home from '../../components/presentation/Home';

describe('The Home component:', () => {
  const enzymeWrapper = shallow(<Home />);
  test('should render the Home component correctly', () => {
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
