import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import UserDocuments from './components/UserDocuments';

export default (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/user/documents" component={UserDocuments} />
  </Switch>
);
