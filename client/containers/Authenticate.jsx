import React from 'react';
import $ from 'jquery';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signInUser } from '../actions/userActions';
/**
 * Renders the authentication form
 */
class Authenticate extends React.Component {
  /**
   * Initializes the functions and state required
   * @param {object} props - the state object containing error information
   */
  constructor(props) {
    super(props);
    this.state = {
      errors: this.props.signIn.errors,
    };
    this.showSignInForm = this.showSignInForm.bind(this);
    this.showSignUpForm = this.showSignUpForm.bind(this);
    this.signUserIn = this.signUserIn.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      errors: nextProps.signIn.errors,
    });
  }
/**
 * Fires the function that authenticates a user
 * @param {object} event - object containing data about the control that
 * triggered an event
 * @return {null} returns void
 */
  signUserIn(event) {
    event.preventDefault();
    const userName = $('#signinform input[type=text]').val();
    const password = $('#signinform input[type=password]').val();
    const formData = { userName, password };
    this.props.signInUser(formData)
    .then((res) => {
      if (!res) {
        this.props.history.push('/user/documents');
      }
    });
  }
/**
 * shows or hides the signin form
 * @return {null} returns void
 */
  showSignInForm() {
    const signInForm = $('#signinform');
    const signUpForm = $('#signupform');
    signUpForm.slideUp(400, () => {
      signInForm.slideDown(400);
    });
  }
/**
 * shows or hides the signup form
 * @return {null} returns void
 */
  showSignUpForm() {
    const signInForm = $('#signinform');
    const signUpForm = $('#signupform');
    signInForm.slideUp(400, () => {
      signUpForm.slideDown(400);
    });
  }
  /**
   * Renders the html content on the browser
   * @return {object} returns an object containing the html to be render
   */
  render() {
    return (
      <div className="container">
        <div id="authbuttons" className="row">
          <div className="col s6">
            <span
              className="a center-align waves-effect waves-light btn"
              href="/"
              onClick={() => { this.showSignInForm(); }}
            >SignIn</span>
          </div>
          <div className="col s6">
            <span
              className="a center-align waves-effect waves-light btn"
              href="/"
              onClick={() => { this.showSignUpForm(); }}
            >SignUp</span>
          </div>
        </div>

        <div id="authform">
          <div id="signinform" className="">
            <input type="text" className="forminput" placeholder="Username" />
            <input type="password" className="forminput" placeholder="Password" />
            <button
              id="signinbtn"
              className="center-align waves-effect waves-light btn"
              onClick={event => this.signUserIn(event)}
            >{this.props.signInButtonText}</button>
          </div>

          <div id="signupform" style={{ display: 'none' }}>

            <div className="">
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
              <button
                id="signinbtn"
                className="center-align waves-effect waves-light btn"
              >Sign Up</button>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

Authenticate.propTypes = {
  signInButtonText: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  signInButtonText: state.signIn.status,
  signIn: state.signIn,
});

export default connect(mapStateToProps,
  { signInUser })(withRouter(Authenticate));
