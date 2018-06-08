import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ViewDocument from './components/container/ViewDocument';
import UserView from './components/container/UserView';
import AllUsersView from './components/container/AllUsersView';
import WriteDocument from './components/container/WriteDocument';
import ReadDocument from './components/container/ReadDocument';
import About from './components/presentation/About';
import ErrorPage from './components/presentation/ErrorPage';

export default (
  <Switch>
    <Route exact path="/user/documents" component={ViewDocument} />
    <Route path="/user/documents/about" component={About} />
    <Route path="/user/documents/createdocument" component={WriteDocument} />
    <Route path="/user/documents/users/all" component={AllUsersView} />
    <Route path="/user/documents/users" component={UserView} />
    <Route path="/user/documents/read" component={ReadDocument} />
    <Route path="/user/*" component={ErrorPage} />
  </Switch>
);
