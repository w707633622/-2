import React, {Fragment} from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Typography, Descriptions, Badge, Divider } from 'antd';

import "../static/add.less" ;  // 使用的add模板

import MyPro from "./getInfocomponent/myproinfo";
import QrPay from "./getInfocomponent/qrpay";
import ScreenShot from "./getInfocomponent/sreenShout";

var MyProWith = withRouter(MyPro)
var QrPayWith = withRouter(QrPay)
var ScreenShotdWith = withRouter(ScreenShot)

const { Title, Paragraph } = Typography;

class GetInfo extends React.Component {
  constructor() {
    super();
    this.apkUploadInfoFileList = [];
    this.zipUploadInfoFileList = [];
    this.screenShoutUploadInfoFileList = [];

    this.state = {

      demoContent: "", // 实现原理
  
    /* 返回的价格,替代默认值 */
      price: 1, // 源码价格
  
      imageList: [], // apk运行到手机上的截图
  
      userid: localStorage.getItem("userInfo") ? JSON.parse( localStorage.getItem("userInfo") ).data.userid : null,
      token: localStorage.getItem("userInfo") ? JSON.parse( localStorage.getItem("userInfo") ).data.token : null,

      fileList: [],

      myProInfo: JSON.parse(sessionStorage.getItem("myProInfo")),
    };
    
  }

  render() {
    return (
      <Fragment>
        {/* 标题 */}
        <div id="addTitle" style={{ margin: 30, padding: 12 }}>
          {"源码详情" }
        </div>
        <div id="addContent" style={{ background: '#fff', minHeight: 500 }}>
          
          {/* 上传apk资源 */}
          <MyProWith myProInfo={this.state.myProInfo} demoName={this.state.demoName} userid={this.state.userid} token={this.state.token}></MyProWith>
          <Divider /> 
        
          {/* 二维码扫描付费 */}
          <QrPayWith myProInfo={this.state.myProInfo} sts={this.state.sts}></QrPayWith>
          <Divider />
          
          {/* 截图显示 */}
          <ScreenShotdWith myProInfo={this.state.myProInfo} ></ScreenShotdWith>
          <Divider />

          {/* 原理 */}
          <Typography style={{margin: "50px"}}>
            <Title>应用信息</Title>
            <Paragraph style={{margin: "30px", fontSize: "18px"}} >
              <Badge status="processing" />
              {this.state.myProInfo.demo ? this.state.myProInfo.demo.info : ""}
            </Paragraph>
          </Typography>
          <Divider />
        </div>
      </Fragment>
    );
  }
}

// 高阶组件 Form.create 后才能使用Form
const Add = Form.create({ name: 'normal_login' })(GetInfo);


export default Add;