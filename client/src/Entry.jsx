import React from 'react';
import { render } from 'react-dom';
import { persistStore } from 'redux-persist';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import localForage from 'localforage';
import { configureStore, history } from './store/configureStore';
import App from './components/presentation/App';

const store = configureStore();
// this line of code is somehow problematic
persistStore(store, { storage: localForage });
// renders the application on the browser
render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route path="/" component={App} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
