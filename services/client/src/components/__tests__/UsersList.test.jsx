import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import UsersList from '../UsersList';

const users = [
  {
    'active': true,
    'email': 'bot1@botland.com',
    'id': 1,
    'username': 'bot1'
  },
  {
    'active': true,
    'email': 'bot2@botland.com',
    'id': 2,
    'username': 'bot2'
  }
];

test('Test UsersList renders correctly', () => {
  const wrapper = shallow(<UsersList users={users} />);
  const element = wrapper.find('h4');
  expect(element.length).toBe(2);
  expect(element.get(0).props.children).toBe('bot1');
})

test('UsersList renders a snapshot properly', () => {
  const tree = renderer.create(<UsersList users={users} />).toJSON();
  expect(tree).toMatchSnapshot();
})