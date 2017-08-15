import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'sweetalert2';
import $ from 'jquery';

/**
 * Fires the function that authenticates a user
 * @param {object} event - object containing data about the control that
 * triggered an event
 * @param {func} signUserUp - function that executes when signing users up
 * @param {object} history - the browser and app state history
 * @param {func} getUserDocuments - Function that executes when
   * fetching documents belonging to a particular user
 * @return {null} returns void
 */
const signUp = (event, signUserUp, history, roleType, allDocuments) => {
  event.preventDefault();
  const userName = $('#signupform input[name=username]').val();
  const email = $('#signupform input[type=email]').val();
  const password = $('#signupform input[name=password]').val();
  const comfirmPassword = $('#signupform input[name=comfirmpassword]').val();
  const roleValue = $('#signupform input[name=group1]:checked')
    .attr('data-value');
  const roleId = $('#signupform input[name=group1]:checked').val();
  const isactive = true;
  const formData =
    { userName, email, password, comfirmPassword, roleId, roleValue, isactive };
  if (password === comfirmPassword) {
    signUserUp(formData)
      .then((res) => {
        if (res.status === 'successful') {
          allDocuments(roleType);
          history.push('/user/documents');
        } else {
          Alert({
            title: 'Error Signing up',
            text: res.message,
            type: 'error',
            confirmButtonText: 'ok'
          });
        }
      });
  } else {
    Alert({
      title: 'Password mispatch',
      text: 'Ensure your password is spelt correctly',
      type: 'error',
      confirmButtonText: 'ok'
    });
  }
};
/**
 * Renders form for signin up new user
 * @return {object} Returns the signup form to render
 */
const SignupForm = ({ signUserUp, history,
  submitButton, roleType, allDocuments }) => (
    <div id="signupform" style={{ display: 'none' }}>
      <input
        className="forminput"
        name="username"
        type="text"
        minLength="3"
        placeholder="Username"
        required
      />
      <input
        className="forminput"
        name="email"
        type="email"
        minLength="10"
        placeholder="Email"
        required
      />
      <input
        className="forminput"
        name="password"
        type="password"
        minLength="6"
        placeholder="Password"
        required
      />
      <input
        className="forminput"
        name="comfirmpassword"
        type="password"
        placeholder="Comfirm password"
        required
      />
      <div id="roles">
        Role:&nbsp;&nbsp;
        <input
          className="with-gap"
          name="group1"
          type="radio"
          data-value="Learning"
          id="Learning"
          value="3"
        />
        <label htmlFor="Learning">Learning</label>
        <input
          className="with-gap"
          name="group1"
          type="radio"
          data-value="Fellow"
          id="Fellow"
          value="2"
        />
        <label htmlFor="Fellow">Fellow</label>
        <input
          className="with-gap"
          name="group1"
          type="radio"
          data-value="DevOps"
          value="4"
          id="DevOps"
        />
        <label htmlFor="DevOps">DevOps</label><br />
      </div>
      <button
        id="signupbtn"
        className="center-align waves-effect waves-light btn"
        onClick={
          event => signUp(event, signUserUp, history, roleType, allDocuments)}
      >{submitButton}</button>
    </div>
  );

SignupForm.propTypes = {
  signUserUp: PropTypes.func.isRequired,
  roleType: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  submitButton: PropTypes.string.isRequired,
  allDocuments: PropTypes.func.isRequired,
};
export default SignupForm;
