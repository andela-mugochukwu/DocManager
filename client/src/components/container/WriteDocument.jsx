import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import CreateDocument from '../presentation/CreateDocument';
import { documentCreation } from '../../actions/documentActions';

const mapStateToProps = state => ({
  userId: state.authenticateUser.userId,
  roleType: state.authenticateUser.roleType,
});

export default connect(mapStateToProps,
  { documentCreation })(withRouter(CreateDocument));
