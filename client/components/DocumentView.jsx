import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

import DocumentPreview from './DocumentPreview';
import { startGetUserDocuments,
  getUserDocuments } from '../actions/documentActions';

class DocumentView extends React.Component {
/**
 * Executes before component mounts
 * @return {null} returns void
 */
  componentWillMount() {
    this.props.startFetchingDocuments();
  }
/**
 * Executes after component has mounted
 * @return {null} returns void
 */
  componentDidMount() {
    // get the user token from storage
    const token = localStorage.getItem('docmanagertoken');
    this.props.fetchDocuments(this.props.id, token);
  }
/**
 * Renders the html elements on the browser
 * @return {object} Returns the html object to render
 */
  render() {
    // Render documents if successsfully loaded from server
    // else show loading message
    const finalRender = (this.props.shouldDisplay) ?
      <DocumentPreview documents={this.props.documents} /> :
      <span>{this.props.documentStatus}</span>;
    return (
      <div id="doc-view-background" className="row">
        {finalRender}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  id: state.signIn.userId,
  documents: state.fetchDocuments.documents,
  shouldDisplay: state.fetchDocuments.display,
  documentStatus: state.fetchDocuments.status,
});

const mapDispatchToProps = dispatch => ({
  startFetchingDocuments: () => {
    dispatch(startGetUserDocuments());
  },
  fetchDocuments: (id, token) => {
    dispatch(getUserDocuments(id, token));
  },
});
DocumentView.propTypes = {
  documentStatus: propTypes.string.isRequired,
  startFetchingDocuments: propTypes.func.isRequired,
  documents: propTypes.array.isRequired,
  id: propTypes.number.isRequired,
  fetchDocuments: propTypes.func.isRequired,
  shouldDisplay: propTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentView);
