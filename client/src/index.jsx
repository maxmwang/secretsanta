import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/:urlroomcode" component={App}></Route>
      <Route path="/" component={App}></Route>
    </Switch>
  </Router>,
  document.getElementById('root')
);
