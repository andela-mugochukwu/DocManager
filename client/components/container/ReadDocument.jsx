import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { changeTitleValue, editDocument } from '../../actions/documentActions';
import ReadDocument from '../presentation/ReadDocument';

const mapStateToProps = state => ({
  documentTitle: state.readDocument.documentTitle,
  documentId: state.readDocument.document.id,
  userId: state.authenticateUser.userId,
  ownerId: state.readDocument.document.userId,
  roleType: state.authenticateUser.roleType,
  docStatus: state.readDocument.docStatus,
  body: state.readDocument.document.body,
  author: state.readDocument.document.author,
  modifiedDate: state.readDocument.document.updatedAt,
});
export default connect(mapStateToProps,
  { changeTitleValue, editDocument })(withRouter(ReadDocument));
