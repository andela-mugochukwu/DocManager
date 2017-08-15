import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

const Search = ({ searchDocuments }) => (
  <div className="searchcontainer">
    <div >
      <input
        type="text"
        onChange={() => {
          const searchText = $('.searchcontainer input').val();
          searchDocuments(searchText);
        }}
        placeholder="search all documents"
      />
    </div>
  </div>
);

Search.propTypes = {
  searchDocuments: PropTypes.func.isRequired,
};

export default Search;
