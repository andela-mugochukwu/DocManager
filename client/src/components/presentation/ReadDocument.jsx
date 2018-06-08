import React from 'react';
import propTypes from 'prop-types';
import parser from 'html-react-parser';
import $ from 'jquery';
import Alert from 'sweetalert2';
import TinyMCE from 'react-tinymce';

let documentBody = '';
const documentValue = {};
const formatDate = (datetime) => {
  if (datetime) {
    const date = datetime.substring(0, datetime.indexOf('T'));
    const formattedDate = new Date(date);
    return formattedDate.toDateString();
  }
};

const processEdit = (editDocument, documentId, history) => {
  const title = $('#title').val();
  if (title !== '') {
    documentValue.title = title;
  }
  if (documentBody !== '') {
    documentValue.body = documentBody;
  }
  editDocument(documentValue, documentId)
    .then((res) => {
      if (res.status === 'successful') {
        Alert({
          title: 'Update successful',
          text: 'You have successfully updated your document',
          type: 'success',
          confirmButtonText: 'ok'
        });
        history.push('/user/documents');
      } else {
        Alert({
          title: 'Error updating document',
          text: res.message,
          type: 'error',
          confirmButtonText: 'ok'
        });
      }
    });
};

const handleEditorChange = (event) => {
  documentBody = event.target.getContent();
};

const ReadDocument = ({ documentTitle, body, author,
  modifiedDate, history, changeTitleValue, editDocument,
  documentId, docStatus, userId, roleType, ownerId }) => (
    <div id="readdocument" className="container">
      <input
        className="center-align"
        id="title"
        type="text"
        onChange={() => {
          changeTitleValue($('#title').val());
        }}
        value={documentTitle}
        disabled
      />
      <div className="" id="docbody">
        {parser(body)}
      </div><br />
      <div id="docbodyedit" className="hide">
        <TinyMCE
          content={body}
          config={{
            plugins: 'autolink link image lists print preview',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright',
            height: 280,
            width: '100%',
            browser_spellcheck: true,
          }}
          onChange={handleEditorChange}
        /><br />
      </div>
      <div>
        <span>Author: {author}</span><br />
        <span>Modified: {formatDate(modifiedDate)}</span>
        <button
          className="btn right"
          onClick={(event) => {
            event.preventDefault();
            history.push('/user/documents');
          }}
        >back</button>
        <button
          id="editbtn"
          style={{ display: userId === ownerId || roleType === 'Admin'
          || roleType === 'SuperAdmin' ? '' : 'none' }}
          className="btn right"
          onClick={(event) => {
            event.preventDefault();
            $('#title').prop('disabled', (i, v) => (!v));
            $('#title').focus();
            $('#docbody, #docbodyedit, #submitbtn, #editbtn')
              .toggleClass('hide');
          }}
        >edit</button>
        <button
          id="submitbtn"
          className="btn right hide"
          onClick={(event) => {
            event.preventDefault();
            processEdit(editDocument, documentId, history);
            editDocument(documentValue, documentId);
          }}
        >{docStatus}</button>
      </div><br />
    </div>
  );

ReadDocument.propTypes = {
  documentTitle: propTypes.string.isRequired,
  body: propTypes.string.isRequired,
  userId: propTypes.number.isRequired,
  ownerId: propTypes.number.isRequired,
  roleType: propTypes.string.isRequired,
  author: propTypes.string.isRequired,
  modifiedDate: propTypes.string.isRequired,
  editDocument: propTypes.func.isRequired,
  documentId: propTypes.number.isRequired,
  changeTitleValue: propTypes.func.isRequired,
  docStatus: propTypes.string.isRequired,
  history: propTypes.shape({
    push: propTypes.func.isRequired,
  }).isRequired,
};
export default ReadDocument;
