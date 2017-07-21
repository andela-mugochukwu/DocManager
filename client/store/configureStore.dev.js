import createHistory from 'history/createBrowserHistory';
import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
// import DevTools from '../containers/DevTools';

const history = createHistory();
const middleware = routerMiddleware(history);
/**
 * Configures the store from the reducers and initial state
 * @param {object} initialState - The initial state of the application
 * @return {object} returns an object that enhances the store
 * and that provides access to the state of the application
 */
const configureStore = initialState => createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(thunkMiddleware, middleware)
    // DevTools.instrument()
  )
);
export { history, configureStore };
