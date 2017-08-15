import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import CreateDocument from '../../components/presentation/CreateDocument';
import '../../mockObjects/localStorage';

describe('The CreateDocument component:', () => {
  const response = { status: 'successful' };
  const props = {
    documentCreation: jest.fn(() => Promise.resolve(response)),
    roleType: 'Learning',
    userId: 1,
  };
  test('should render correctly', () => {
    const enzymeWrapper = shallow(<CreateDocument {...props} />);
    const component = enzymeWrapper;
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  test(`should not fire createDocument function when create button is clicked
  and the form is empty`,
    () => {
      const event = {
        preventDefault: () => 'Hello',
      };
      const setFormValue = jest.fn();
      setFormValue.mockReturnValueOnce({
        title: 'Hello',
        body: 'Hi',
      });
      const enzymeWrapper = shallow(<CreateDocument {...props} />);
      enzymeWrapper.find('#docform button[name="action"]')
      .props().onClick(event);
      expect(props.documentCreation.mock.calls.length).toBe(0);
    });

  test('should fire handleEditorChange when text in TinyMCE changes',
    () => {
      const event = {
        target: { getContent: () => 'hello', },
      };
      const handleEditorChange = jest.fn();
      const enzymeWrapper = shallow(<CreateDocument {...props} />);
      enzymeWrapper.find('TinyMCE').props().onChange(event);
      expect(handleEditorChange.mock.calls.length).not.toBeGreaterThan(1);
    });
});
