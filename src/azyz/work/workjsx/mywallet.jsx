import React, { Fragment } from 'react';
import { notification, Row, Col, Avatar, Button, Divider, Card, Icon } from 'antd';
import axios from "axios";
import CryptoJS from "crypto-js";
import store from "../../../store/store";
import "./static/myapp.less";

class MyWallet extends React.Component {

    constructor() {
        super();
        this.state = {
            userid: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).data.userid : null,
            token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).data.token : null,

            dayTime: "",

            loading: false,

            perLogin: this.time(store.getState().userInfo.data.preLoginTime),
            canTake:0,
            profit:0,
            yue:0,
        }
    }

    componentDidMount() {
        var requestdata = {
            userid: this.state.userid,
            token: this.state.token,
        }
        axios.get("http://106.15.196.78:8080/azyz/order/getWalletInfo", {  // 上线
        // axios.get("/azyz/order/getWalletInfo", { // 开发
            params: {
                requestdata: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(requestdata)))
            }
        })
        .then(
            result => {
                if ("成功" === result.data.message) {
                    console.log(result.data.data)
                    this.setState({
                        canTake: result.data.data.canTake,  // 可提现金额
                        profit: result.data.data.profit,  // 	总收益
                        yue: result.data.data.yue,  // 账户余额
                    })
                }
            }
        )
        .catch(
            e => e
        )

        var date = new Date();
        var h = date.getHours()
        if (3 <= h && h < 6) {
            this.setState({ dayTime: "凌晨好，" });
        } else if (6 <= h && h < 8) {
            this.setState({ dayTime: "早晨好，" });
        } else if (8 <= h && h < 11) {
            this.setState({ dayTime: "上午好，" });
        } else if (11 <= h && h < 13) {
            this.setState({ dayTime: "中午好，" });
        } else if (13 <= h && h < 17) {
            this.setState({ dayTime: "下午好，" });
        } else if (17 <= h && h < 19) {
            this.setState({ dayTime: "傍晚好，" });
        } else if (19 <= h && h < 23) {
            this.setState({ dayTime: "晚上好，" });
        } else if ((23 <= h && h < 24) || (0<= h && h <3)) {
            this.setState({ dayTime: "深夜好，" });
        }
  
    }

    render() {
        var headStyle = { textAlign: 'center', fontSize: 32 };
        var bodyStyle = { textAlign: 'center', padding: 24, fontSize: 38 };
        return (
            <Fragment>
                {/* 标题 */}
                <div id="mywalletTitle" style={{ margin: 30, padding: 12 }}>
                    我的钱包
                </div>
                {/* 钱包内容区 */}
                <div id="mywalletcontent" style={{ padding: 24, background: '#fff', minHeight: 650 }}>
                    <Row id="mywalletcontentTitle" type="flex" justify="center" align="middle" gutter={{ xs: 8, sm: 16, md: 24 }} >
                        <Col  xl={6} md={24}>
                            <Row type="flex" justify="center" align="middle">
                                <Avatar size={140} icon="user" src={store.getState().userInfo.data.headImage}/>
                            </Row>
                        </Col>
                        <Col xl={14} lg={12} >
                            <Row type="flex" align="middle" style={{ height: 80,  color: "#fff", fontSize: 32}}>
                                <Col>{this.state.dayTime}{store.getState().userInfo.data.nickname}</Col>
                            </Row>
                            <Divider></Divider>
                            <Row type="flex" align="middle" style={{ height: 80,  color: "#fff", fontSize: 24}}>
                                <Col>上次登录时间: {this.time(this.state.perLogin)} </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row id="mywalletcontentCon" type="flex" justify="center" align="top" gutter={{xs: 8, sm: 16, md: 24}} style={{padding: 30}}>
                        <Col>
                            <Card title="帐户余额" headStyle={headStyle} bodyStyle={bodyStyle} style={{ width: 260, margin: 12 }} bordered={false}>
                                {this.state.yue}
                            </Card>
                        </Col>
                        <Col>
                            <Card title="可提现金额" headStyle={{ ...headStyle, color: "#d37e21" }} bodyStyle={{ ...bodyStyle, color: "#d37e21" }} style={{ width: 260, margin: 12 }} bordered={false} actions={[<Button loading={this.state.loading} onClick={this.tixian} type="primary" style={{ height: 48, width: 200, fontSize: 22}}>微信提现</Button>]}>
                                {this.state.canTake}
                            </Card>
                        </Col>
                        <Col>
                            <Card title="总收益" headStyle={headStyle} bodyStyle={bodyStyle} style={{ width: 260, margin: 12 }} bordered={false}>
                                {this.state.profit}
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        )
    }
    
    time = (time) => {
        // 比如需要这样的格式 yyyy-MM-dd hh:mm:ss
        var date = new Date(time);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        // var h = date.getHours() + ':';
        // var m = date.getMinutes() + ':';
        // var s = date.getSeconds();
        // console.log(Y + M + D + h + m + s); // 输出结果：2014-04-23 18:55:49
        return (Y + M + D)
    }

    tixian = () => {
        this.setState({
            loading: true,
        })
        var requestdata = {
            userid: this.state.userid,
            token: this.state.token,
        }
        axios({
            method: 'post',
            // url: '/azyz/order/tixian', // 开发
            url: 'http://106.15.196.78:8080/azyz/order/tixian',// 上线
            data: "requestdata=" + JSON.stringify(requestdata)
        })
        .then((res) => {
            console.log(res)
            this.setState({ loading: false, })
            if (res.data) {
            } else {
                this.openNotification("数据获取失败")
            }
            if ("未绑定微信,请绑定微信" === res.data.message) {
                this.openNotification("未绑定微信,请绑定微信")
            } else if ("提现成功" === res.data.message) {
                this.openNotification("提现成功")
            }
        })
        .catch()
    }

    openNotification = (info) => {
        var message, description, icon;
        switch (info) {
            case "未绑定微信,请绑定微信":
                message = "您未绑定微信"
                description = "您未绑定微信,请绑定微信"
                icon = <Icon type="info-circle" style={{ color: '#eb2f96' }} />
                break;
            case "提现成功":
                message = "提现成功"
                description = "提现成功"
                icon = <Icon type="smile" style={{ color: '#108ee9' }} />
                break;
            case "数据获取失败":
                message = "数据获取失败"
                description = "数据获取失败,请重新获取"
                icon = <Icon type="close-circle" style={{ color: '#eb2f96' }} />
                break;
            default:
                break;
        }

        notification.open({
            message,
            description,
            icon,
            // onClick: () => {
            //     console.log('Notification Clicked!');
            // },
        });
    };
}

export default MyWallet;