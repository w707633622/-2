import React, { Component } from 'react';
import { Menu, Icon, Layout, message, Avatar, Row, Col } from 'antd';
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";

class SiderUI extends Component {

    constructor() {
        super();
        this.state = {
            defaultSelectedKeys: null,
            collapsed: false,
            disabled: localStorage.getItem("userInfo") ? false : true, // 是否禁用

            ifUserInfo: localStorage.getItem("userInfo") ? true : false,

            rootSubmenuKeys: ["mine", 'sub2'], //所有展开列表的key
            openKeys: [],
        };
    }

    componentDidMount () { // 从首页的头像中点击过来 
        if ( "fromAvatar" === this.props.location.state ) { // 从我的头像点击我的项目
            var newOpenKeys = [...this.state.openKeys]
            if (!newOpenKeys.includes("mine")) { // 从我的头像点击我的项目 我的列表是不是已经展开
                newOpenKeys.push("mine")
                this.setState({
                    openKeys: newOpenKeys
                });
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props !== nextProps && ("myappkey" || "walletkey" === nextProps.selectKey) && "fromAvatar" === nextProps.location.state) { // 从我的头像点击我的项目
            var newOpenKeys = [...this.state.openKeys]
            if( !newOpenKeys.includes("mine") ) { // 从我的头像点击我的项目 我的列表是不是已经展开
                newOpenKeys.push("mine")
                this.setState({
                    openKeys: newOpenKeys
                });
            }
        }
        return true
    }

    render() {
        return (
            <Layout.Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
            >
                {/* <div className="logo">
                    <Row type="flex" justify="end" align="middle" style={{ backgroundColor: "#001529" }} gutter={{ xs: 8, sm: 16, md: 24}}>
                        <Col span={this.state.collapsed ? 24 : 5}>
                            <Avatar
                                src={require("./static/img/logo.png")}
                                shape="square"
                            />
                        </Col>
                        <Col span={this.state.collapsed ? 0 : 12} >
                            
                            <Row type="flex" align="middle" style={{ color:"#40a9ff", fontSize: 16}}>
                                安卓驿站
                            </Row>
                        </Col>
                    </Row>
                </div> */}
                <Menu 
                    theme="dark"
                    defaultSelectedKeys={[this.props.selectKey == null ? 'marketkey' : this.props.selectKey]}
                    mode="inline"
                    onClick={ this.handleClick }
                    openKeys={this.state.openKeys}
                    selectedKeys={[this.props.selectKey == null ? 'marketkey' : this.props.selectKey]} // 当前选中的菜单项 key 数组,就是现在点击了谁
                    onOpenChange={this.onOpenChange}
                >
                    <Menu.Item key="marketkey">
                        <NavLink to="/azyz/work/market">
                            <Icon type="shopping" />
                            <span>市场</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.SubMenu
                        key="mine"
                        title={<span><Icon type="user" /><span>我的</span></span>}
                        onTitleClick={this.onClickMine} // 点击子菜单标题,这里不适用onclick
                    >
                         <Menu.Item key="myappkey" disabled={this.state.disabled}>
                            <NavLink to="/azyz/work/myapp">
                                <Icon type="project" />
                                <span>我的项目</span>
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="addkey" disabled={this.state.disabled}>
                            <NavLink to="/azyz/work/add">
                                <Icon type="file-add" />
                                <span>添加</span>
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item id="mylikekey" key="mylikekey" disabled={this.state.disabled}>
                            <NavLink to="/azyz/work/mylike">
                                <Icon type="heart" />
                                <span>我的收藏</span>
                            </NavLink> 
                        </Menu.Item>
                        <Menu.Item id="mywalletkey" key="mywalletkey" disabled={this.state.disabled}>
                            <NavLink to="/azyz/work/mywallet">
                                <Icon type="wallet" />
                                <span>我的钱包</span>
                            </NavLink>
                        </Menu.Item>
                    </Menu.SubMenu>
                    {/* <Menu.SubMenu
                        key="sub2"
                        title={<span><Icon type="team" /><span>Team</span></span>}
                    >
                        <Menu.Item key="6">Team 1</Menu.Item>
                        <Menu.Item key="8">Team 2</Menu.Item>
                    </Menu.SubMenu> */}
 {/* 测试         */}
                    {/* <Menu.Item key="testkey">
                        <NavLink to="/work/test">
                            <Icon type="file" />
                            <span>Test</span>
                        </NavLink>
                    </Menu.Item> */}
                </Menu>
            </Layout.Sider>
        );
    }

    handleClick = (e) => {
        console.log('click ', e.key);
        this.setState({
            defaultSelectedKeys: e.key.toString(),
            userInfo: localStorage.getItem("userInfo"),
        });
        // 保存选中的Menu.Item
        sessionStorage.setItem("selectKey", e.key.toString())
        setTimeout(() => {
            this.props.getSelectMenuKey(this.state.defaultSelectedKeys)
        }, 0);
    }

    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({ collapsed });
    }

    onClickMine = () => {
        if (localStorage.getItem("userInfo")) {
            this.setState({
                ifUserInfo: true,
                disabled: false,
            })
        } else {
            this.setState({
                ifUserInfo: false,
                disabled: true,
            }, () => { message.info('您未登录，请登录！'); })
        }
    }

    onOpenChange = openKeys => {
        this.setState({ // 因为从头像点击我的项目要让我的展开,所以这里手动控制开关
            openKeys: openKeys
        })
    }
}

// 数据组件
// state表示store中combineReducers中参数对象, state.workSelectKey就拿到了workSelectReducer中state的初始值
function mapStateToProps(state) {  //获取状态
    return {
        selectKey: state.workSelectKey,
        serchDate: state.serchDate
    };
}
function mapDispathchToProps(dispatch) { // 派发任务
    return {
        getSelectMenuKey(key) {
            dispatch({ type: 'GET_MENU_KEY', payload: key });
        }
    };
}

// 高阶组件,将UI组建和数据组件分离
var Sider = connect(mapStateToProps, mapDispathchToProps)(SiderUI);

export default Sider;