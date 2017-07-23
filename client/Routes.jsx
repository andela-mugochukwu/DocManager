import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/presentation/Home';
import UserPage from './components/UserPage';

export default (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/user/documents" component={UserPage} />
  </Switch>
);
