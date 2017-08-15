import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import Search from '../../components/presentation/Search';

describe('The search box component:', () => {
  const props = {
    searchDocuments: jest.fn(() => Promise.resolve()),
  };
  const enzymeWrapper = mount(<Search {...props} />);
  test('should display bold white bottom border when focused', () => {
    const searchDocuments = jest.fn(() => Promise.resolve());
    const component = renderer.create(
      <Search searchDocuments={searchDocuments} />
  );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should submit the search text when clicked', () => {
    enzymeWrapper.find('.searchcontainer input').props().onChange();
    expect(props.searchDocuments.mock.calls.length).toBe(1);
  });
});
