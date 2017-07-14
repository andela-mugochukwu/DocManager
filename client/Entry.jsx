import React from 'react';
import { render } from 'react-dom';
// import { AppContainer } from 'react-hot-loader';
import { configureStore, history } from './store/configureStore';
import Root from './containers/Root';

const store = configureStore();

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
