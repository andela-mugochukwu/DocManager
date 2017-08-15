import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import userRoutes from '../userRoutes';

import { publicDocuments,
  roleDocuments,
  allDocuments,
  getUserDocuments,
  } from '../actions/documentActions';
import { fetchAllUsers, signOut } from '../actions/userActions';

const minHeight = {
  minHeight: window.innerHeight - 131 ||
  document.documentElement.clientHeight - 131
};
const signOutUser = (event, history, signUserOut) => {
  event.preventDefault();
  if (localStorage.getItem('docmanagertoken')) {
    localStorage.removeItem('docmanagertoken');
  }
  signUserOut();
  history.push('/');
};

const fetchUserDocs = (event, getUserDocs, userId, history) => {
  event.preventDefault();
  getUserDocs(userId);
  history.push('/user/documents');
};

const UserPage = ({ userName, userId, history, signUserOut,
  getPublicDocuments, getRoleDocuments, getAllUsers,
  getUserDocs, getAllDocuments, roleType }) => (
    <section className="row" style={minHeight}>
      <div id="docheader" className="header">
        <span className="left">DocManger</span>
        <span className="right">
          <a
            href="/"
            onClick={(event) => {
              signOutUser(event, history, signUserOut);
            }}
          >Hi {userName}! Sign Out&nbsp;
          <i className="fa fa-sign-out" aria-hidden="true" /></a>
        </span>
        <div className="row">
          <div className="col m10 offset-m2">
            <button
              className="btn"
              onClick={(event) => {
                event.preventDefault();
                getAllDocuments(roleType);
                history.push('/user/documents');
              }}
            >All Documents&nbsp;
            <i className="fa fa-file-archive-o" aria-hidden="true" /></button>

            <button
              name="public"
              className="btn"
              onClick={(event) => {
                event.preventDefault();
                getPublicDocuments();
                history.push('/user/documents');
              }}
            >Public Documents&nbsp;
            <i className="fa fa-globe" aria-hidden="true" /></button>

            <button
              className="btn"
              onClick={(event) => {
                event.preventDefault();
                getRoleDocuments(roleType);
                history.push('/user/documents');
              }}
            >{roleType} Documents&nbsp;
              <i className="fa fa-key" aria-hidden="true" /></button>
          </div>
        </div>
      </div>

      <div id="doccontent" className="row">
        <div className="col m2 header" >
          <h5 className="btn">Dashboard&nbsp;&nbsp;
            <i className="fa fa-tasks" aria-hidden="true" />
          </h5><hr />

          <a
            className="center-align btn"
            onClick={(event) => {
              fetchUserDocs(event, getUserDocs, userId, history);
            }}
            href="/user/documents"
          >
          My Documents&nbsp;&nbsp;
            <i className="fa fa-unlock-alt" aria-hidden="true" />
          </a>

          <Link className="center-align btn" to="/user/documents/createdocument">
          Create document&nbsp;&nbsp;
            <i className="fa fa-pencil-square-o" aria-hidden="true" />
          </Link><hr />

          <Link className="center-align btn" to="/user/documents/users">
          My Profile&nbsp;&nbsp;
          <i className="fa fa-user" aria-hidden="true" /></Link>

          <a
            className="center-align btn"
            href="/user/documents/users/all"
            style={{ display: roleType === 'Admin'
            || roleType === 'SuperAdmin' ? '' : 'none' }}
            onClick={(event) => {
              event.preventDefault();
              getAllUsers();
              history.push('/user/documents/users/all');
            }}
          >
          Manage Users&nbsp;&nbsp;
          <i className="fa fa-users" aria-hidden="true" /></a>

          <Link className="center-align btn" to="/user/documents/about">
          About&nbsp;&nbsp;
          <i className="fa fa-question-circle" aria-hidden="true" /></Link>

        </div>

        <div id="contentdisplay" className="col m10">
          <div className="container" style={minHeight}>
            {userRoutes}
          </div>
        </div>
      </div>

      <footer><a href="/">DocManager &copy;2017</a></footer>
    </section>
);

UserPage.propTypes = {
  userName: propTypes.string.isRequired,
  userId: propTypes.number.isRequired,
  roleType: propTypes.string.isRequired,
  history: propTypes.shape({
    push: propTypes.func.isRequired,
  }).isRequired,
  signUserOut: propTypes.func.isRequired,
  getPublicDocuments: propTypes.func.isRequired,
  getRoleDocuments: propTypes.func.isRequired,
  getAllDocuments: propTypes.func.isRequired,
  getUserDocs: propTypes.func.isRequired,
  getAllUsers: propTypes.func.isRequired,
};

const mapStateToProps = state => ({
  userName: state.authenticateUser.userName,
  userId: state.authenticateUser.userId,
  roleType: state.authenticateUser.roleType,
});

const mapDispatchToProps = dispatch => ({
  getPublicDocuments: () => {
    dispatch(publicDocuments());
  },
  getAllUsers: () => {
    dispatch(fetchAllUsers());
  },
  getRoleDocuments: (roleType) => {
    dispatch(roleDocuments(roleType));
  },
  signUserOut: () => {
    dispatch(signOut());
  },
  getUserDocs: (id) => {
    dispatch(getUserDocuments(id));
  },
  getAllDocuments: (roletype) => {
    dispatch(allDocuments(roletype));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
