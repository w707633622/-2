import React, {Fragment} from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Input, InputNumber, Row, Col, Button, Icon, Divider, message } from 'antd';

import store from "../../../store/store"; // 没有使用redux-react原因是暴露组件已经使用了高阶组件，无法两次使用

import axios from "axios";
import CryptoJS from "crypto-js";
import "./static/add.less"
import OSS from "ali-oss";

import ApkUpload from "./addcomponent/apkUpload";
import ZipUpload from "./addcomponent/zipUpload";
import ScreenShotUpload from "./addcomponent/screenShotUpload";

var ApkUploadWith = withRouter(ApkUpload)
var ZipUploadWith = withRouter(ZipUpload)
var ScreenShotUploadWith = withRouter(ScreenShotUpload)

class AddFrom extends React.Component {
  constructor() {
    super();
    this.apkUploadInfoFileList = [];
    this.zipUploadInfoFileList = [];
    this.screenShoutUploadInfoFileList = [];

    this.state = {
      demoName: "", // 项目名称
      info: "", // 项目的一句话简介
      demoContent: "", // 实现原理
  
    /* 接收apk子组件传递过来的值 */
      demoIcon: "",  // 项目图标
      packageName: "",  // 包名
      versionName: "",  // 项目版本
      versionCode: 0,   // 项目版本号
      apkLength: 0,   // apk大小
      apkUrl: "",  // apk项目下载地址
  
    /* 接收zip源码子组件传递过来的值 */
      codeLength: 0,  // 源码大小
      codeUrl:  "",  // 源码下载地址
  
    /* 返回的价格,替代默认值 */
      price: 1, // 源码价格
  
      imageList: [], // apk运行到手机上的截图
  
      userid: JSON.parse( localStorage.getItem("userInfo") ).data.userid,
      token: JSON.parse( localStorage.getItem("userInfo") ).data.token,

      sts: {
        accessKeyId: "",
        accessKeySecret: "",
        stsToken: "",
      },

      fileList: [],

      myProInfo: {},
    };
    
  }

/* 接收apkUpload组件信息 */
  apkUploadInfo = info => {
    // console.log(info); // 通过父组件件setState第二个参数设置传参
    this.apkUploadInfoFileList = info.fileList;
    this.setState({
      demoIcon: info.demoIcon,
      packageName: info.packageName,
      versionName: info.versionName,
      versionCode: info.versionCode,
      apkLength: parseInt(info.apkLength),
      fileList: [...this.apkUploadInfoFileList, ...this.zipUploadInfoFileList, ...this.screenShoutUploadInfoFileList],
      apkUrl: info.apkUrl,
    })
  }

/* 接收zipUpload组件信息 */
  zipUploadInfo = info => {
    // console.log(info); // 通过父组件件setState第二个参数设置传参
    this.zipUploadInfoFileList = info.fileList;
    this.setState({
      codeLength: info.codeLength,
      codeUrl: info.codeUrl,
      fileList: [...this.apkUploadInfoFileList, ...this.zipUploadInfoFileList, ...this.screenShoutUploadInfoFileList],
    })
  }

/* 接收screenShoutUpload组件信息 */
  screenShoutUploadInfo = info => {
    // console.log(info); // 通过父组件件setState第二个参数设置传参
    this.screenShoutUploadInfoFileList = info.fileList;
    this.setState({
      imageList: info.imageList,
      fileList: [...this.apkUploadInfoFileList, ...this.zipUploadInfoFileList, ...this.screenShoutUploadInfoFileList],
    })
  }

  /* base64图转二进制 */
  dataURLtoBlob = (dataurl) => {
    var arr = dataurl.split(',');   //注意base64的最后面中括号和引号是不转译的                    
    var _arr = arr[1].substring(0, arr[1].length - 2);
    var mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(_arr),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime
    });
  }

/* 表单提交函数 */
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) { // 红*号
        console.log('values', values);
        this.setState({
          demoName: values.apprName,
          info: values.apprInfo,
          price: values.apprPrice,
          demoContent: values.appTheory,
        }, () => {
            if ("" === this.state.packageName | undefined === this.state.packageName) { // 判断apk是否已将选择
              message.error(`apk文件还没选择,请选择要上传的文件`);
              return false;
            } else if ("" === this.state.apkUrl) {
              message.error(`apk还没上传完毕,请等待上传完毕`);
              return false;
            } else if (0 === this.state.codeLength | undefined === this.state.codeLength) { // 判断zip是否已将选择
              message.error(`源码压缩文件还没选择,请选择要上传的源码`);
              return false;
            } else if ("" === this.state.codeUrl) {
              message.error(`源码还没上传完毕,请等待上传完毕`);
              return false;
            } else if (0 === this.screenShoutUploadInfoFileList.length) {
              message.error(`截图还没有选择,请选择要上传的截图`);
              return false;
            } else if (this.state.imageList.length !== this.screenShoutUploadInfoFileList.length) {
              message.error(`截图还没上传完毕,请等待上传完毕`);
            } else {
              this.setState({loading: true})
              var requestdata = {
                demo: {
                  demoId: "/work/edit" === this.props.location.pathname ? store.getState().myProInfo.demo.demoId : "",
                  demoName: this.state.demoName,
                  info: this.state.info,
                  demoContent: this.state.demoContent,
                  demoIcon: this.state.demoIcon,
                  packageName: this.state.packageName,
                  versionName: this.state.versionName,
                  versionCode: this.state.versionCode,
                  apkLength: this.state.apkLength,
                  codeLength: this.state.codeLength,
                  apkUrl: this.state.apkUrl,
                  price: this.state.price,
                  codeUrl: this.state.codeUrl,
                  imageList: this.state.imageList,
                },
                user: {
                  id: JSON.parse(localStorage.getItem("userInfo")).data.id,
                  userid: this.state.userid,
                  token: this.state.token,
                }
              }
              console.log(requestdata)

              if ("/work/add" === this.props.location.pathname) {  // 上传页面
                axios({
                  method: 'post',
                  // url: '/azyz/demo/add',  // 开发
                  url: 'http://106.15.196.78:8080/azyz/demo/add',// 上线
                  data: "requestdata=" + JSON.stringify(requestdata),
                })
                  .then(
                    (res) => {
                      this.setState({ loading: false });
                      if ("成功" === res.data.message) {
                        message.success("上传成功！");
                      } else {
                        message.error("服务器错误,上传失败!");
                        console.log(res);
                      }
                    }
                  )
                  .catch(e => e)
              }

              if ("/work/edit" === this.props.location.pathname) {  // 编辑页面
                axios({
                  method: 'post',
                  // url: '/azyz/demo/edit',  // 开发
                  url: 'http://106.15.196.78:8080/azyz/demo/edit',// 上线
                  data: "requestdata=" + JSON.stringify(requestdata),
                })
                  .then(
                    (res) => {
                      this.setState({ loading: false });
                      if ("成功" === res.data.message) {
                        message.success("编辑成功！");
                      } else {
                        message.error("服务器错误,上传失败!");
                        console.log(res);
                      }
                    }
                  )
                  .catch(e => e)
              }
            }
        });  
      } else {
        return false;
      }
    });
  }

  /* 价格变化函数 */
  handelInputNumberOnChange = (value) => {
    if(value < 1) {
      message.error("您的价格小于1元,默认为1元");
      this.setState({ price: 1 });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps === this.props && "/work/edit" === nextProps.location.pathname){
      nextState.myProInfo = store.getState().myProInfo
      if (nextState.myProInfo.demo !== undefined) {
        nextProps.form.setFieldsValue({  // 注意死循环，上面的第一个判断条件可以阻止死循环
          'apprName': nextState.myProInfo.demo.demoName,
          'apprInfo': nextState.myProInfo.demo.info,
          'apprPrice': nextState.myProInfo.demo.price,
          'appTheory': nextState.myProInfo.demo.demoContent,
        })
        this.setState({
          demoName: nextState.myProInfo.demo.demoName,
          myProInfo: store.getState().myProInfo,
        })
      } else {
        this.props.history.push({pathname: "/azyz/work/myapp"})
      }
      return true
    }

    if (nextProps !== this.props && "/work/add" === nextProps.location.pathname && this.props.location.state) {
      // store.dispatch({ type: 'CLER_DATA', payload: {} })
      console.log(454545454)
      this.props.form.setFieldsValue({  // 注意死循环，上面的第一个判断条件可以阻止死循环
        'apprName': '',
        'apprInfo': '',
        'apprPrice': 1,
        'appTheory': '',
      })
      this.setState({
        demoName: "", // 项目名称
        info: "", // 项目的一句话简介
        demoContent: "", // 实现原理
    
      /* 接收apk子组件传递过来的值 */
        demoIcon: "",  // 项目图标
        packageName: "",  // 包名
        versionName: "",  // 项目版本
        versionCode: 0,   // 项目版本号
        apkLength: 0,   // apk大小
        apkUrl: "",  // apk项目下载地址
    
      /* 接收zip源码子组件传递过来的值 */
        codeLength: 0,  // 源码大小
        codeUrl:  "",  // 源码下载地址
    
      /* 返回的价格,替代默认值 */
        price: 1, // 源码价格
    
        imageList: [], // apk运行到手机上的截图

        fileList: [],

        myProInfo: {},
      })
      return false
    }

    return true
  }


  componentDidMount() {
    
  /* 获取STS */
    var requestdata = {
      userId: this.state.userid,
      token: this.state.token
    }

    axios.get('http://106.15.196.78:8080/azyz/system/getAliyunToken', { // 上线
    // axios.get('/azyz/system/getAliyunToken', { //开发
      params: {
        requestdata: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(requestdata)))
      }
    })
    .then(
      (res) => {
        // console.log(res)
        if ("获取成功" === res.data.message) { // 获取STS临时权限
          // console.log(res.data);
          this.setState({
            sts: {
              accessKeyId: res.data.data.accessKeyId,
              accessKeySecret: res.data.data.accessKeySecret,
              stsToken: res.data.data.securityToken,
            },
            client: new OSS({  // 实例化上传oss对象
              region: 'oss-cn-beijing',
              accessKeyId: res.data.data.accessKeyId,
              accessKeySecret: res.data.data.accessKeySecret,
              stsToken: res.data.data.securityToken,
              endpoint: 'oss-cn-beijing.aliyuncs.com',
              bucket: 'ymw-resource'
            }),
          });
        } else {
          message.error(res.data.message);
        }
      }
    )
    .catch(e => e)
  /* 获取STS */

  }

  render() {
    
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };

    //表单双向绑定 https://ant.design/components/form-cn/#components-form-demo-validate-other
    const { getFieldDecorator } = this.props.form;

    return (
      <Fragment>
        {/* 标题 */}
        <div id="addTitle" style={{ margin: 30, padding: 12 }}>
          {"/work/edit" === this.props.location.pathname ? "编辑项目" : "添加项目" }
        </div>
        <div id="addContent" style={{ background: '#fff', minHeight: 500 }}>
        <Form onSubmit={this.handleSubmit} className="login-form">
          
          <Row id="appTitle">
            <Col span={8} offset={1} >
              <Form.Item
                label={ "/work/add" === this.props.location.pathname ? '添加app项目' : '编辑app项目'}
                colon={false}
              >
              </Form.Item>
            </Col>
          </Row>
          <Divider />

          {/* 上传apk资源 */}
            <ApkUploadWith apkUploadInfo={this.apkUploadInfo} myProInfo={this.state.myProInfo} demoName={this.state.demoName} userid={this.state.userid} token={this.state.token} sts={this.state.sts}></ApkUploadWith>
            <Divider style={{ margin: "10px", opacity: "0" }} />  {/* 分割线透明,上下边框 */}
          
          {/* 上传源码资源 */}
            <ZipUploadWith zipUploadInfo={this.zipUploadInfo} myProInfo={this.state.myProInfo} sts={this.state.sts}></ZipUploadWith>
            <Divider />
          
          {/* 项目名称 */}
            <Row style={{ padding: '0 24px' }} align="middle">
            <Col span={12} >
              <Form.Item
                {...formItemLayout}
                label={'项目名称'}
                required={true} //label前是否有红*
              >
                {getFieldDecorator('apprName', {
                  rules: [{ required: true, message: '给你的项目起个名字呗~~!' },{ max: 30, message: '最多输入30个字!' },{ min: 2, message: '最少输入2个字!' }],
                })(
                  <Input prefix={<Icon type="appstore" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="app名字" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
                  <span className="ant-form-text" style={{margin: 24}}> *名称最多不超过30个汉字，不少于2个汉字</span>
            </Col>
          </Row>
          <Divider />

          {/* 项目简介 */}
          <Row style={{ padding: '0 24px' }}>
            <Col span={12}>
              <Form.Item
                {...formItemLayout}
                colon={true}
                label={'项目简介'}
              >
                {getFieldDecorator('apprInfo', {
                    rules: [{ required: true, message: '一句话介绍一下你的项目吧~~!' },{ max: 100, message: '最多输入100个字!' }],
                  })(
                    <Input placeholder="请输入项目描述" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
                  <span className="ant-form-text" style={{margin: 24}}> *简介最多不超过100个汉字，不少于2个汉字</span>
            </Col>
          </Row>
          <Divider />

          {/* 价格 */}
            <Row style={{ padding: '0 24px'}} >
              <Col span={12}>
                <Form.Item
                    {...formItemLayout}
                    colon={true}
                    label={'项目价格'}
            >
                    {getFieldDecorator('apprPrice', {
                      rules: [{ required: true, message: '请输入app价格!' }],
                      initialValue: 1
                    })( 
                          <InputNumber
                              size="large"
                              style={{ width: 100, marginLeft: 10 }}
                              formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value.replace(/\¥\s?|(,*)/g, '')}
                              min={1}
                              onChange={this.handelInputNumberOnChange}
                            />  
                  )}
                </Form.Item>
              </Col>
              <Col span={12} pull={7}>
                <span className="ant-form-text" style={{ margin: 24 }}> *最低价格为1元</span>
              </Col>
            </Row>
          <Divider />

          {/* 截图上传 */}
            <ScreenShotUploadWith screenShoutUploadInfo={this.screenShoutUploadInfo} myProInfo={this.state.myProInfo} sts={this.state.sts}></ScreenShotUploadWith>
          <Divider />

          {/* 原理 */}
            <Row style={{ padding: '0 24px' }}>
            <Col span={18} pull={1}>
              <Form.Item
                {...formItemLayout}
                colon={true}
                label={'实现原理'}
              >
                {getFieldDecorator('appTheory', {
                    rules: [{ required: true, message: '简单介绍一下你的实现原理~~!' },{ max: 300, message: '最多输入300个字!' }],
                  })(
                    <Input.TextArea 
                      placeholder="说说你的实现原理"
                      autosize = {{ minRows: 6, maxRows: 10 }}
                      />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Divider />

          {/* 提交按钮 */}
          <Row>
            <Col style={{ margin: '12px 12px 24px 12px' }} span={3} push={1}>
              <Button type="primary" htmlType="submit" className="login-form-button" block>
                确认提交
              </Button>
            </Col>
          </Row>
        </Form>
        </div>
      </Fragment>
    );
  }
}

// 高阶组件 Form.create 后才能使用Form
const Add = Form.create({ name: 'normal_login' })(AddFrom);


export default Add;