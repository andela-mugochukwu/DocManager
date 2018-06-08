import React from 'react';
import propTypes from 'prop-types';

import { DocumentPreview } from './DocumentPreview';
import Search from '../container/Search';

const DocumentView = ({ documents, shouldDisplay, read, deleteId,
  documentStatus, readDocument, history, deleteDocument, paginateDocument,
  documentAccess, currentPage, documentsCount, roleType, id }) => {
  const finalRender = (shouldDisplay) ?
    (
      <div>
        <Search />
        <DocumentPreview
          userDocuments={documents}
          read={read}
          deleteId={deleteId}
          readDocument={readDocument}
          history={history}
          deleteDocument={deleteDocument}
          paginateDocument={paginateDocument}
          documentAccess={documentAccess}
          currentPage={currentPage}
          documentsCount={documentsCount}
          roleType={roleType}
          userId={id}
        />
      </div>
    ) :
      (<div>
        <Search />
        <p id="status" className="center-align">{documentStatus}</p>
      </div>);
  /**
 * Renders the html elements on the browser
 * @return {object} Returns the html object to render
 */
  return (// Render documents if successsfully loaded from server
    // else show loading message
    <div id="doc-view-background" >
      {finalRender}
    </div>);
};

DocumentView.propTypes = {
  documentStatus: propTypes.string.isRequired,
  documents: propTypes.arrayOf(propTypes.shape()).isRequired,
  history: propTypes.shape({
    push: propTypes.func.isRequired,
  }).isRequired,
  paginateDocument: propTypes.func.isRequired,
  readDocument: propTypes.func.isRequired,
  deleteDocument: propTypes.func.isRequired,
  read: propTypes.number.isRequired,
  deleteId: propTypes.number.isRequired,
  shouldDisplay: propTypes.bool.isRequired,
  id: propTypes.number.isRequired,
  documentsCount: propTypes.number.isRequired,
  currentPage: propTypes.number.isRequired,
  documentAccess: propTypes.string.isRequired,
  roleType: propTypes.string.isRequired,
};

export default DocumentView;
