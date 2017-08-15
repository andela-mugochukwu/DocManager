import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { editUserDetail, changeInputValue } from '../../actions/userActions';
import UserView from '../presentation/UserView';

const formatDate = (datetime) => {
  if (datetime) {
    const date = datetime.substring(0, datetime.indexOf('T'));
    const formattedDate = new Date(date);
    return formattedDate.toDateString();
  }
};

const mapStateToProps = state => ({
  userName: state.authenticateUser.userName,
  updateStatus: state.authenticateUser.updateStatus,
  disabled: state.authenticateUser.disabled,
  userEmail: state.authenticateUser.updateEmail,
  userId: state.authenticateUser.userId,
  roleType: state.authenticateUser.roleType,
  createdAt: formatDate(state.authenticateUser.createdAt),
});

export default
connect(mapStateToProps, { editUserDetail,
  changeInputValue })(withRouter(UserView));
