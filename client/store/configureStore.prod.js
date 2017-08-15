import createHistory from 'history/createBrowserHistory';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';

export const history = createHistory();
const middleware = routerMiddleware(history);

/**
 * Configures the store from the reducers and
 * initial state which is used in production environment
 * @param {object} initialState - The initial state of the application
 * @return {object} returns an object that enhances the store
 * and that provides access to the state of the application
 */
export const configureStore = initialState => createStore(
  rootReducer,
  initialState,
  applyMiddleware(middleware, thunkMiddleware)
);

