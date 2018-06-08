import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Authenticate from '../presentation/Authenticate';
import { signInUser, signUserUp } from '../../actions/userActions';
import { allDocuments } from '../../actions/documentActions';

// Maps the application state to component properties
const mapStateToProps = state => ({
  submitButton: state.authenticateUser.authButtonStatus,
  roleType: state.authenticateUser.roleType,
});

export default connect(mapStateToProps,
  { signUserUp, signInUser, allDocuments })(withRouter(Authenticate));
