import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import Form from '../Form';

// const formData = {
//   username: '',
//   email: '',
//   password: ''
// }

const testData = [
  {
    formType: 'Register',
    formData: {
      username: '',
      email: '',
      password: ''
    }
  },
  {
    formType: 'Login',
    formData: {
      email: '',
      password: ''
    }
  },
];

testData.forEach((data) => {
  test(`Ensure ${data.formType} Form renders properly`, () => {
    const component = <Form formType={data.formType} formData={data.formData} />;
    const wrapper = shallow(component);
    const h1 = wrapper.find('h1');
    expect(h1.length).toBe(1);
    expect(h1.get(0).props.children).toBe(data.formType);
    const formFields = wrapper.find('.field');
    expect(formFields.length).toBe(Object.keys(data.formData).length);
    expect(formFields.get(0).props.children.props.name).toBe(Object.keys(data.formData)[0]);
    expect(formFields.get(0).props.children.props.value).toBe('');
  });

  test(`${data.formType} form renders a snapshot properly`, () => {
    const component = <Form formType={data.formType} formData={data.formData} />;
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
})
// test('Ensure register Form renders properly', () => {
//   const component = <Form formType={'Register'} formData={formData} />;
//   const wrapper = shallow(component);
//   const h1 = wrapper.find('h1');
//   expect(h1.length).toBe(1);
//   expect(h1.get(0).props.children).toBe('Register');
//   const formFields = wrapper.find('.field');
//   expect(formFields.length).toBe(3);
//   expect(formFields.get(0).props.children.props.name).toBe('username');
//   expect(formFields.get(0).props.children.props.value).toBe('');
// });

// test('Ensure Login Form renders properly', () => {
//   const component = <Form formType={'Login'} formData={formData} />;
//   const wrapper = shallow(component);
//   const h1 = wrapper.find('h1');
//   expect(h1.length).toBe(1);
//   expect(h1.get(0).props.children).toBe('Login');
//   const formFields = wrapper.find('.field');
//   expect(formFields.length).toBe(2);
//   expect(formFields.get(0).props.children.props.name).toBe('email');
//   expect(formFields.get(0).props.children.props.value).toBe('');
// });

// test('register form renders a snapshot properly', () => {
//   const component = <Form formType={'Register'} formData={formData} />;
//   const tree = renderer.create(component).toJSON();
//   expect(tree).toMatchSnapshot();
// });

// test('login form renders a snapshot properly', () => {
//   const component = <Form formType={'Login'} formData={formData} />;
//   const tree = renderer.create(component).toJSON();
//   expect(tree).toMatchSnapshot();
// });