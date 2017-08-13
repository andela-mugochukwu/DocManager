import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import About from '../../components/presentation/About';
import '../../mockObjects/localStorage';

describe('The About component:', () => {
  const props = {
  };
  test('should render correctly', () => {
    const enzymeWrapper = mount(<About {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
