import React from 'react';

import Auth from '../container/Auth';

/**
 * Renders the home screen of the application
 * @return {object} - Returns the html to render
 */
const home = () => (
  <div className="homescreen">
    <h1 className="center-align">DocManger</h1>
    <p className="center-align">
      Create, secure and access documents
      from anywhere in the world.
    </p>
    <Auth />
  </div>
  );
export default home;
