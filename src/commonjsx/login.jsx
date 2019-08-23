import React from 'react';
import { Menu, Avatar, Dropdown, Icon, Modal, Button } from 'antd';
import axios from "axios";
import store from "../store/store";
import useCookie from "../commonjs/useCookie"

class Login extends React.Component {

    /* 未获取信息时的登录 */
    state = { 
        visible: false,
        userInfo: {},
        // testCode: null  // 开发
    }

    showModal = () => { // 点击登录后事件
        console.log(111555)
        this.setState({
            visible: true,
        });
        // 未获取到用户信息 点击登录后显示二维码
        setTimeout(() => { 
            if(this.state.visible){
                var pathname = window.location.pathname
                var hash = window.location.hash
                var redirect_uri = encodeURIComponent("http://106.15.196.78" + pathname + hash);
                console.log(redirect_uri)
                // const redirect_uri = encodeURIComponent(window.location.href);
                // WxLogin在public的index中引入,必须在window下才能找到
                new window.WxLogin({
                    self_redirect:false,
                    id:"login_container",  // 显示二维码容器
                    appid: "wxe2783aa1b3d3d6cc", 
                    scope: "snsapi_login", 
                    redirect_uri: redirect_uri,
                    state: "",
                    style: "",
                    href: ""
                });
            }
        }, 10);
    }

    handleOk = (e) => { // 点击确定按钮的回调,测试时使用
        console.log(e);
        this.setState({
            visible: false,
            // testCode: "codeceshi" // 开发
        });
        setTimeout(() => {
            this.componentDidMount()
        }, 10);
    }

    handleCancel = (e) => { //点击遮罩层或右上角叉或取消按钮的回调
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    // GetQueryString = (code) => { // 获取url中的code值
    //     var reg = new RegExp("(^|&)" + code + "=([^&]*)(&|$)");
    //     var r = decodeURI(window.location.search.substr(1)).match(reg);
    //     if (r != null)return unescape(r[2]);
    //     return null;
    // }

    constructor() {
        super();
        this.cookie = new useCookie()
    }

    componentDidMount(){
        var reg = /(\?code=)(.+)(\&state=)(.*)/;
        var href = window.location.href;

        /* 获取code */
        // var wxCode = this.GetQueryString("code"); // GetQueryString为自定义获取url中的code值
        var wxCode = null;

        if(href){
            href.replace(reg, ($0, $1, $2, $3, $4) => {
                // console.log($0);
                // console.log($1);
                wxCode = $2;
                // console.log($2);
                // console.log($3);
              return ;
            })
        }

        // 配置axios请求参数
        var requestdata = {
            // wxCode: this.state.testCode,  // 开发
            wxCode: wxCode, // 上线
            state: "JFKDSAIE"
        }

        if (wxCode != null ) { // 上线
        // if (this.state.testCode != null ) { // 开发

            // var wxCode_ = decodeURIComponent(wxCode);
            // alert(wxCode_)
            console.log(1212)
            axios({
                method: 'post',
                // url: '/azyz/user/login', // 开发
                url: 'http://106.15.196.78:8080/azyz/user/login',// 上线
                data: "requestdata="+ JSON.stringify(requestdata)
            })
            .then(
                // (res) => { console.log(res) }
                (res) => { 
                    console.log(res)
                    if( "登录成功" === res.data.message ) {
                        var userInfo = JSON.stringify(res.data)
                        localStorage.setItem("userInfo", userInfo)
                        this.setState({
                            userInfo: res.data
                        }, () => {
                            store.dispatch({ type: 'SET_USER_INFO', payload: this.state.userInfo} )
                            window.location.reload()
                        })
                        this.cookie.setCookie('isCloseBrowser', "yes")   // 这里只会保存一份,新页面如果有localStorage信息就不会走这里
                    }
                 }
                )
            .catch( e => e )
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     // console.log(store.getState().workSelectKey)
    //     var wxCode = this.GetQueryString("code"); // GetQueryString为自定义获取url中的code值
    //     console.log(wxCode)
    //     return true
    // }

/* 判断是否关闭了浏览器,如果关闭了就清除登录信息 */
    componentWillMount() {  // 组件初始化时只调用，以后组件更新不调用，整个生命周期只调用一次
        // console.log(this.cookie.getCookie('isCloseBrowser'))
        if (this.cookie.getCookie('isCloseBrowser') === 'undifeind') { // 关闭了浏览器
            localStorage.removeItem("userInfo")
            this.setState({
                userInfo: {}
            })
        }
    }
    
    render(){
        // console.log(this.props.userInfo.data.nickname)
    /* 获取用户信息登录后用户头像框,鼠标hover后显示的内容 */
        const dropDownmenu = (
            <Menu onClick={this.dropDownClick}>
                <Menu.Item key="homekey" ><Icon type="home" />首页</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="myappkey"><Icon type="project" />我的项目</Menu.Item>
                <Menu.Item key="mywalletkey"><Icon type="wallet" />我的钱包</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3"><Icon type="logout" />退出</Menu.Item>
            </Menu>
        );

    /* 判断显示 登录框 还是 用户信息 */
        if(localStorage.getItem("userInfo")){  // 获取到用户信息时显示
            return(
                <Dropdown overlay={dropDownmenu} >
                    <div className="ant-dropdown-link">
                        <Avatar size="large" icon="user" src={store.getState().userInfo.data.headImage} />
                        <span style={{
                            width: 150
                        }}>{store.getState().userInfo.data.nickname}</span>
                        <Icon type="down" />
                    </div>
                </Dropdown>
            );
        } else {
            return( // 未获取到用户信息时显示登录
                <div>
                    <Button type="primary" onClick={this.showModal}>
                        登录
                    </Button>
                    <Modal
                        title="登录"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        destroyOnClose={true}
                        footer={null} // 不需要默认确定取消按钮
                        width={400}
                    >
                        <div // 显示二维码容器
                            id="login_container"
                            style={{
                                height:400
                            }}
                        >
                        </div>
                    </Modal>
                </div>
            );
        }
    }


    dropDownClick = ({ key }) => {
        if ("myappkey" === key) { // 从头像点击 我的项目 跳转
            console.log(`Click on item ${key}`)
            sessionStorage.setItem("selectKey", key.toString()) // 保存点击的item的key
            store.dispatch({ type: 'GET_MENU_KEY', payload: key });
            this.props.history.push("/azyz/work/myapp", "fromAvatar")
        }
        else if ("homekey" === key) { // 从头像点击 首页 跳转
            this.props.history.push("/azyz/home")
            console.log(`Click on item ${key}`)
        }
        else if ("mywalletkey" === key) { // 从头像点击 我的钱包 跳转
            console.log(`Click on item ${key}`)
            sessionStorage.setItem("selectKey", key.toString()) // 保存点击的item的key
            store.dispatch({ type: 'GET_MENU_KEY', payload: key });
            this.props.history.push("/azyz/work/mywallet", "fromAvatar")
        } 
        else if ("3" === key ){
            // console.log(`Click on item ${key}`)
            this.setState({
                userInfo: {}
            })
            localStorage.removeItem("userInfo")
            window.location.reload()
        }
        else {
            return;
        }
    }
}

export default Login;