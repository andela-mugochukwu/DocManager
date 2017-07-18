import React from 'react';
import propTypes from 'prop-types';

/**
 * Template to render documents from store
 * @return {object} returns html object to render
 */
const DocumentPreview = ({ documents }) => {
  const docs = documents.map(document => (
    <div key={document.id}>
      <h5>Title: {document.title}</h5>
      <h5>Access: {document.access}</h5>
      <button id={document.id}>Read</button>
      <button id={document.id}>Edit</button>
      <button id={document.id}>Delete</button>
    </div>));
  return (
    <div className="col s3">
      {docs}
    </div>);
};

DocumentPreview.propTypes = {
  documents: propTypes.array.isRequired,
};

export default DocumentPreview;
