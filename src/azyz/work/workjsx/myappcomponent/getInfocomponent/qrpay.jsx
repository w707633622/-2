import React from 'react';
import {  Card, Row, Col, Button, Icon, message, Modal} from 'antd';
import axios from "axios";
import CryptoJS from "crypto-js";
import QRCode from 'qrcode'
import "./qrpay.less"

class QrPay extends React.Component {

constructor() {
    super();
    this.state = {
        visible: false,

        status: 0,
        payUrl: "",

        apkUrl: "",
        demoId: "",
        price: 0,
        userid: localStorage.getItem("userInfo") ? JSON.parse( localStorage.getItem("userInfo") ).data.userid : "",
        token: localStorage.getItem("userInfo") ? JSON.parse( localStorage.getItem("userInfo") ).data.token : "",
        myProInfo: JSON.parse(sessionStorage.getItem("myProInfo")),
    }
    this.data = ""
}

componentDidMount() {
    QRCode.toDataURL(this.props.myProInfo.demo.apkUrl, { errorCorrectionLevel: 'H'})
    .then(url => {
        this.setState({
            apkUrl: url,
            demoId: this.props.myProInfo.demo.demoId,
            price: this.props.myProInfo.demo.price,
        })
    })
    .catch(err => {
        console.error(err)
    })
    /* 获取codeurl */
    if (this.state.userid) {
        var requestdata = {
            demoId: this.props.myProInfo.demo.demoId,
            userId: this.state.userid,
            token: this.state.token
        }
        axios.get('http://106.15.196.78:8080/azyz/demo/getCodeUrl', { // 上线
        // axios.get('/azyz/demo/getCodeUrl', { // 开发
            params: {
            requestdata: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(requestdata)))
            }
        })
        .then(
            (res) => {
                if ( 4002 === res.data.status ) {
                    this.setState({
                        status: res.data.status,
                    });
                    this.data = res.data.data;
                }
            }
        )
        .catch(e => e)
    }
    /* 获取codeurl */
}

showModal = () => { // 点击下载源码
    console.log("点击下载源码")
    if (!this.state.userid) {
        message.info("您还未登录，请登录后下载")
    }
    if ( 4002 === this.state.status ) {
        console.log(8)
        QRCode.toDataURL(this.data, { errorCorrectionLevel: 'H'})
        .then(url => {
            this.setState({
                payUrl: url,
                visible: true,
            })
        })
        .catch(err => {
            console.error(err)
        })
    }
};

handleOk = e => {
console.log(e);
this.setState({
    visible: false,
});
};

handleCancel = e => {
console.log(e);
this.setState({
    visible: false,
});
};

render() {
    return(
        <Row >
            <Col span={10} offset={2}>
                <Card
                    style={{ width: 300 }}
                    cover={
                    <img
                        alt="example"
                        src={this.state.apkUrl}
                    />
                    }
                >
                    <Card.Meta
                    style={{ textAlign: "center", fontSize: "24px"}}
                    title="扫描体验apk"
                    />
                </Card>,
            </Col>
            <Col span={10} >
                <Card bordered={false} title="" style={{margin: "58px", width: 300 }}>
                    <div style={{color: "#EEAD0E",fontSize: "80px", textAlign: "center"}}> ¥ {this.state.price} </div>
                    <Button type="link">
                            <div onClick={this.showModal} style={{fontSize: "24px", textAlign: "center"}}> <Icon type="download" /> <span>点击下载源码</span> </div>
                    </Button>
                    <Modal
                        title="微信支付"
                        visible={this.state.visible}
                        centered={true}
                        maskClosable={true}
                        okText="已经支付"
                        cancelText="支付失败"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <img src={this.state.payUrl} alt=""/>
                    </Modal>
                </Card>
            </Col>
        </Row>
    )
}
}

export default QrPay;