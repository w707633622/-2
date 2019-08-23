import React, { Component, Fragment } from 'react';

import { enquireScreen } from 'enquire-js';
import DocumentTitle from 'react-document-title';
// import Header from './homejsx/Header';
import Banner from './homejsx/Banner';
// import Page1 from './homejsx/Page1';
// import Page2 from './homejsx/Page2';
// import Page3 from './homejsx/Page3';
// import Page4 from './homejsx/Page4';
import Footer from './homejsx/Footer';
import './homejsx/static/style.js';

import { withRouter } from 'react-router-dom';

// var HeaderWith = withRouter(Header);

let isMobile = false;
enquireScreen((b) => {
  isMobile = b;
});

class Home extends Component {

    state = {
        isFirstScreen: true,
        isMobile,
      };
    
      componentDidMount() {
        enquireScreen((b) => {
          this.setState({
            isMobile: !!b,
          });
        });
      }
    
      onEnterChange = (mode) => {
        this.setState({
          isFirstScreen: mode === 'enter',
        });
      }

    render() {
        return (
            <Fragment>
                {/* <HeaderWith key="header" isFirstScreen={this.state.isFirstScreen} isMobile={this.state.isMobile} /> */}
                <Banner key="banner" onEnterChange={this.onEnterChange} />
                {/* <Page1 key="page1" isMobile={this.state.isMobile} />
                <Page2 key="page2" isMobile={this.state.isMobile} />
                <Page3 key="page3" isMobile={this.state.isMobile} />
                <Page4 key="page4" isMobile={this.state.isMobile}  /> */}
                <Footer key="footer" isMobile={this.state.isMobile} />
                <DocumentTitle title="安卓驿站 - 源码交易平台" key="title" />
            </Fragment>
        );
    }
}

export default Home;