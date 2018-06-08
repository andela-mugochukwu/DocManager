import React from 'react';

import '../../styles/home.scss';
import Routes from '../../Routes';

/**
 * Renders the component that houses the entire app
 * @return {object} - Returns the html to render
 */
const App = () => {
  const minHeight = {
    minHeight: window.innerHeight || document.documentElement.clientHeight,
  };
  return (
    <section style={minHeight} className="bkgImage">
      {Routes}
    </section>
  );
};

export default App;
