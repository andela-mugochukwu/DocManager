import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import userRoutes from '../userRoutes';

const minHeight = {
  minHeight: window.innerHeight - 153 ||
  document.documentElement.clientHeight - 153
};
const UserDocuments = ({ userName }) => (
  <section className="row">
    <div id="docheader" className="header">
      <div className="row">
        <span className="right">
          <Link to="/">Sign Out</Link>
        </span>
        <span className="right">Welcome {userName}</span>
      </div>
      <div className="row">
        <div className="col s8 offset-s4">
          <button
            className="center-align waves-effect waves-light btn"
          >Public Docs</button>
          <button
            className="center-align waves-effect waves-light btn"
          >Role Docs</button>
          <button
            className="center-align waves-effect waves-light btn"
          >All Docs</button>
        </div>
      </div>
    </div>

    <div id="doccontent" className="row">
      <div className="col s3 header" style={minHeight}>
        <h4>Dashboard</h4>
        <hr />
        <p>
          Hi {userName} , you have created  documents
        </p>
        <hr />
        <Link to="/user/documents">My docs</Link><br />
        <Link to="/user/documents/createdocument">Create docs</Link><br />
        <Link to="/user/documents/users">View all users</Link>
        <div>
          <input type="text" placeholder="search own documents" />
          <a>search</a>
        </div>
      </div>
      <div id="dashboard" className="col s9">
        <div className="row">
          <div className="col s8">
            <input type="text" placeholder="search my documents" />
          </div>
          <div className="col s2">
            <i className="fa fa-search-plus small" aria-hidden="true">Search</i>
          </div>
        </div>
        <div>
          {userRoutes}
        </div>
      </div>
    </div>

    <footer>DocManager &copy;2017</footer>
  </section>
);

UserDocuments.propTypes = {
  userName: propTypes.string.isRequired,
};

const mapStateToProps = state => ({
  userName: state.signIn.userName,
});
export default connect(mapStateToProps)(UserDocuments);
