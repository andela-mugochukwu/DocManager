import React from 'react';

const CreateDocument = () => (
  <div>
    <input type="text" placeholder="title" />
    <textarea name="" id="" cols="100" rows="10" placeholder="content" />
    Access level:
    <p>
      <input className="with-gap" name="group1" type="radio" id="public" value="public" />
      <label htmlFor="public">Public</label>
    </p>
    <p>
      <input className="with-gap" name="group1" type="radio" id="role" />
      <label htmlFor="role">Role</label>
    </p>
    <p>
      <input className="with-gap" name="group1" type="radio" id="private" />
      <label htmlFor="private">Private</label>
    </p>
    <button
      className="btn waves-effect waves-light"
      type="submit"
      name="action"
      onClick={(event) => {
        event.preventDefault();
      }}
    >create
    </button>
  </div>
);

export default CreateDocument;
