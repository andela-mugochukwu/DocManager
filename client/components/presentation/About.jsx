import React from 'react';

/**
 * Renders the about page of the application
 * @return {object} - Returns the html to render
 */
const About = () => (
  <div className="aboutpage container">
    <h3 className="center-align">About DocManger</h3>
    <hr />
    <p>
      DocManger is an electronic document management system
      that helps you manage your
      documents for easy sharing and accessing.
      It offers features such as creating, editing,
      restricting and sharing personal documents.
    </p>
    <h4 className="center-align">Contributors</h4>
    <hr />
    <ol>
      <li>Mazi Ugochukwu Kingsley</li>
      <li>Mark Edomwande</li>
    </ol>
  </div>);


export default About;
