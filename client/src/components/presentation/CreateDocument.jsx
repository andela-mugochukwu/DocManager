import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import Alert from 'sweetalert2';
import TinyMCE from 'react-tinymce';

let documentBody = '';

/**
 * Creates a document object from the form
 * @param {number} userId - the userId that creating the document
 * @return {object} returns the form value to use in creting the document
 */
const setFormValue = (userId) => {
  const title = $('#docform input[name=title]').val();
  const body = documentBody;
  const access = $('#docform input[name=group1]:checked').val();
  const token = localStorage.getItem('docmanagertoken');
  const formValue = { title, body, access, userId, token };
  return formValue;
};

/**
 * Submits a completed form to create a document
 * @param {object} event - contains information
 * about the element raising the event
 * @param {func} documentCreation - a function that handles
 * the event to create documents
 * @param {object} formValue - the value of the form used to create document
 * @return {null} returns null
 */
const createDocument = (event, documentCreation, formValue) => {
  event.preventDefault();
  if (formValue.token && formValue.title !== '' && formValue.body !== '') {
    documentCreation(formValue).then((res) => {
      if (res.status === 'successful') {
        Alert({
          title: res.status,
          text: 'Your document has been created',
          type: 'success',
          confirmButtonText: 'ok'
        });
        document.getElementById('form').reset();
        documentBody = '';
      } else {
        Alert({
          title: res.status,
          text: res.message,
          type: 'error',
          confirmButtonText: 'ok'
        });
      }
    });
  } else {
    Alert({
      title: 'Incomplete form',
      text: 'Fill the form completely before submitting to the server',
      type: 'error',
      confirmButtonText: 'ok'
    });
  }
};

const handleEditorChange = (event) => {
  documentBody = event.target.getContent();
};
/**
 * Component that renders the form to create a document
 * @param {object} an object containing properties for creating a document
 * @return {object} returns the html to render
 */
const CreateDocument = ({ documentCreation, userId, roleType }) => (
  <form id="form" action="">
    <div id="docform">
      <input type="text" placeholder="title" name="title" />
      <TinyMCE
        content=""
        config={{
          plugins: 'autolink link image lists print preview',
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright',
          height: 280,
          width: '100%',
          browser_spellcheck: true,
        }}
        onChange={handleEditorChange}
      /><br />
      <div>
        Access level:
      <input
        className="with-gap"
        name="group1"
        type="radio"
        id="public"
        value="Public"
      />
        <label id="docrole" htmlFor="public">Public</label>
        <input
          className="with-gap"
          name="group1"
          value={roleType}
          type="radio"
          id="role"
        />
        <label htmlFor="role">{roleType}</label>
        <input
          className="with-gap"
          name="group1"
          type="radio"
          value="Private"
          id="private"
        />
        <label htmlFor="private">Private</label>
        <button
          className="btn waves-effect waves-light right"
          type="submit"
          name="action"
          onClick={(event) => {
            const formValue = setFormValue(userId);
            createDocument(event, documentCreation, formValue);
          }}
        >create
    </button>
      </div>
    </div>
  </form>
);

CreateDocument.propTypes = {
  documentCreation: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  roleType: PropTypes.string.isRequired,
};

export default CreateDocument;
