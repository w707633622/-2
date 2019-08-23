import React, { Component } from 'react';
import { Layout } from 'antd';

import Home from './azyz/home/home';
import Work from './azyz/work/work';

import Header from "./commonjsx/header"

import './App.css';

//路由
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  withRouter,
} from 'react-router-dom';

var HeaderWith = withRouter(Header);

class App extends Component {

  render() {

    return (
      <Router>
        <div className="App">
          {/* Header */}
          <Layout.Header style={{ background: '#fff', padding: 0 }} >
            <HeaderWith></HeaderWith>
          </Layout.Header>
          <Switch>
            <Route path="/azyz/home" component={Home} />
            <Route path="/azyz/work" component={Work} />
            <Redirect from="/*" to="/azyz/home"></Redirect>
          </Switch>
        </div>
      </Router>
    );
  }

}

export default App;
