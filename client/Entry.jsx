import React from 'react';
import { render } from 'react-dom';
import { configureStore, history } from './store/configureStore';
import Root from './Root';

const store = configureStore();
// renders the application on the browser
render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
