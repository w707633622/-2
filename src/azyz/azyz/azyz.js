import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { Layout } from 'antd';
import "./azyz.css";

import Header from "./azyzjsx/header";
import Sider from "./azyzjsx/sider";

import Home from "../home/home"

import Add from "../work/workjsx/add";
import MyApp from "../work/workjsx/myapp";
import Market from "../work/workjsx/market";
import GetInfo from "../work/workjsx/myappcomponent/getInfo";
import MyLike from "../work/workjsx/mylike";
import MyWallet from "../work/workjsx/mywallet";
import Test from "../work/workjsx/test";


import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    withRouter
} from 'react-router-dom';

// Work下的子路由没有被路由管理，获取三大对象 1. history 2. location 3. match 
var SiderWith = withRouter(Sider);
var HeaderWith = withRouter(Header);

var AddWith = withRouter(Add);
var MyAppWith = withRouter(MyApp);
var MarketWith = withRouter(Market);
var GetInfoWith = withRouter(GetInfo);
var MyLikeWith = withRouter(MyLike);
var MyWalletWith = withRouter(MyWallet);
var TestWith = withRouter(Test);

class Azyz extends Component {

    state = {
        mathRouter: "",  // 记录在work页面上次点击
        ifUserInfo: localStorage.getItem("userInfo") ? true : false,  // 是否存在userinfo信息
    };

    constructor() {
        super();
        this.mathRouter = sessionStorage.getItem("selectKey");
    }

    render() {

        // 记录在work页面上次点击的是 mypp 还是 add 还是...
        switch (this.mathRouter) {
            case "addkey":
                this.mathRouter = "add"
                break;
            case "myappkey":
                this.mathRouter = "myapp"
                break;
            case "mylikekey":
                this.mathRouter = "mylike"
                break;
            case "marketkey":
                this.mathRouter = "market"
                break;
            case "testkey":
                this.mathRouter = "test"
                break;
            case "mywalletkey":
                this.mathRouter = "mywallet"
                break;
            default:
                this.mathRouter = "market"
                break;
        }

        return (
            <Router>
                <Layout style={{ minHeight: '100vh' }}>
                    {/* Sider */}
                    <SiderWith></SiderWith>
                    <Layout>

                        {/* Header */}
                        <Layout.Header style={{ background: '#fff', padding: 0 }} >
                            <HeaderWith></HeaderWith>
                        </Layout.Header>

                        {/* /azyz/work/路由 */}
                        {/* Content */}

                        <Switch>
                            <Route path="/azyz/work/market">
                                <Layout.Content style={{ margin: '0 16px' }}>
                                    <MarketWith />
                                </Layout.Content>
                            </Route>
                            <Route path="/azyz/work/myapp">
                                <Layout.Content style={{ margin: '0 16px' }}>
                                    {this.state.ifUserInfo ? <MyAppWith /> : <div>页面失效</div>}
                                </Layout.Content>
                            </Route>
                            <Route path="/azyz/work/add">
                                <Layout.Content style={{ margin: '0 16px' }}>
                                    {this.state.ifUserInfo ? <AddWith /> : <div>页面失效</div>}
                                </Layout.Content>
                            </Route>
                            <Route path="/azyz/work/edit">
                                <Layout.Content style={{ margin: '0 16px' }}>
                                    {this.state.ifUserInfo ? <AddWith /> : <div>页面失效</div>}
                                </Layout.Content>
                            </Route>
                            <Route path="/azyz/work/getinfo">
                                <Layout.Content style={{ margin: '0 16px' }}>
                                    {this.state.ifUserInfo ? <GetInfoWith /> : <GetInfoWith />}
                                </Layout.Content>
                            </Route>
                            <Route path="/azyz/work/mylike">
                                <Layout.Content style={{ margin: '0 16px' }}>
                                    {this.state.ifUserInfo ? <MyLikeWith /> : <div>页面失效</div>}
                                </Layout.Content>
                            </Route>
                            <Route path="/azyz/work/mywallet">
                                <Layout.Content style={{ margin: '0 16px' }}>
                                    {this.state.ifUserInfo ? <MyWalletWith /> : <div>页面失效</div>}
                                </Layout.Content>
                            </Route>
                            <Route path="/azyz/work/test">
                                <Layout.Content style={{ margin: '0 16px' }}>
                                    <TestWith />
                                </Layout.Content>
                            </Route>
                            {/* 根据记录的上次点击 从首页进入项目 进行路由重定向 */}
                            <Redirect from="/azyz/work" to={"/azyz/work/" + this.mathRouter} />
                        </Switch>

                        {/* Footer */}
                        <Layout.Footer style={{ textAlign: 'center' }}>
                            安卓驿站 ©2018 Created GWM
                        </Layout.Footer>

                    </Layout>
                    <DocumentTitle title="安卓驿站 - 源码交易平台" key="title" />
                </Layout>
            </Router>
        );
    }

}

export default Azyz;