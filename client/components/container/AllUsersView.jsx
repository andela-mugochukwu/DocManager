import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import AllUsersView from '../presentation/AllUsersView';
import { deactivateUser, fetchAllUsers } from '../../actions/userActions';

const mapStateToProps = state => ({
  allUsers: state.fetchAllUsers.users,
  responseStatus: state.fetchAllUsers.responseStatus,
  currentPage: state.fetchAllUsers.currentPage,
  counter: state.fetchAllUsers.counter,
  error: state.fetchAllUsers.status,
  deactivatedUserId: state.deactivateUser.deactivatedId,
});

export default connect(mapStateToProps,
  { deactivateUser, fetchAllUsers })(withRouter(AllUsersView));
