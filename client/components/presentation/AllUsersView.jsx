import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'sweetalert2';
import Pagination from 'react-js-pagination';

const processRole = (roleId) => {
  switch (roleId) {
  case 1:
    return 'SuperAdmin';
  case 2:
    return 'Admin';
  case 3:
    return 'Fellow';
  case 4:
    return 'Learning';
  case 5:
    return 'Devops';
  default:
    break;
  }
};

const formatDate = (datetime) => {
  if (datetime) {
    const date = datetime.substring(0, datetime.indexOf('T'));
    const formattedDate = new Date(date);
    return formattedDate.toDateString();
  }
};

const AllUsersView = ({ allUsers, responseStatus, error,
  deactivateUser, counter, currentPage,
  fetchAllUsers }) => {
  const users = allUsers.map(user => (
    <tr id={user.id} key={user.id}>
      <td>
        <span>{user.username}</span>
      </td>
      <td>
        <span>{user.email}</span>
      </td>
      <td>
        <span>{processRole(user.roleId)}</span>
      </td>
      <td>
        <span>{formatDate(user.createdAt)}</span>
      </td>
      <td>
        <button
          id="useractionbtn"
          onClick={(event) => {
            event.preventDefault();
            Alert({
              title: `Comfirm ${user.isactive
        ? 'Deactivation' : 'Activation'}`,
              text: `Are you sure you want to
              ${user.isactive
        ? 'Deactivate' : 'Activate'} ${user.username}`,
              type: 'info',
              showCloseButton: true,
              showCancelButton: true,
              confirmButtonText:
                '<i class="fa fa-thumbs-up"></i> Yes!',
              cancelButtonText:
                '<i class="fa fa-thumbs-down"></i> No',
              showLoaderOnConfirm: true,
              preConfirm: () => new Promise((resolve, reject) => {
                deactivateUser(user.id)
                .then((res) => {
                  if (res.status === 'successful') {
                    resolve();
                  } else {
                    reject();
                  }
                });
              }),
              allowOutsideClick: false
            }).then(() => {
              Alert({
                type: 'success',
                title: `${user.isactive
                ? 'Activation' : 'Deactivation'} successful!`,
              });
            });
          }}
        >{user.isactive ? 'Deactivate' : 'Activate'}</button>
      </td>
      {/* <td>
        <button
          onClick={(event) => {
            event.preventDefault();
          }}
        >Change Role</button>
      </td> */}
    </tr>
  ));

  const userDetailsTable = (
    <div id="viewusers">
      <table className="table">
        <thead>
          <tr>
            <th>
              <span>UserName</span>
            </th>
            <th>
              <span>UserEmail</span>
            </th>
            <th>
              <span>Department/Role</span>
            </th>
            <th>
              <span>Registered on</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {users}
        </tbody>
      </table>
      <div className={counter > 8 ? 'row' : 'row hide'}>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={8}
          totalItemsCount={counter}
          pageRangeDisplayed={5}
          onChange={(pageNumber) => {
            const offSet = (pageNumber - 1) * 8;
            fetchAllUsers(offSet, pageNumber);
          }}
        />
      </div>
    </div>
    );
  const errorMessage = <p>{error}</p>;
  return (<section>
    {responseStatus === 'successful' ? userDetailsTable : errorMessage}
  </section>
  );
};

AllUsersView.propTypes = {
  allUsers: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    roleId: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
  })).isRequired,
  counter: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  error: PropTypes.string.isRequired,
  fetchAllUsers: PropTypes.func.isRequired,
  responseStatus: PropTypes.string.isRequired,
  deactivateUser: PropTypes.func.isRequired,
};

export default AllUsersView;
