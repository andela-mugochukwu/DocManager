import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import App from '../presentation/App';
/**
 * The entry point of the redux application
 * @param {object} store - It contains the state of the application
 * @param {object} history - It holds the browser history
 * @return {oject} The entire html to render to the browser
 */
const Root = ({ store, history }) => (
  <Provider store={store}>
    <div>
      <ConnectedRouter history={history}>
        <Route path="/" component={App} />
      </ConnectedRouter>
    </div>
  </Provider>
);

export default Root;

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
