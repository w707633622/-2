import React from "react";
import { Row, Col, List, Avatar, Icon, Button, Modal, message } from 'antd';
import { connect } from "react-redux";
import axios from "axios";
import CryptoJS from "crypto-js";
import "./mypro.css";

class MyProUI extends React.Component {
  constructor() {
    super();
    this.state = {
      pager: 0, // 当前页
      page: 0, // 当前页
      size: 3, // 每页显示项目数
      userId: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).data.userid : null,
      token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).data.token : null,

      demoList: [],

      apkLength: 0, // 大小
      count: 0, // 下载次数
      versionName: "" // 版本
    }
    this.listData = [];
  }

  componentDidMount() {
    var requestdata = {
      pager: this.state.pager,
      userId: this.state.userId,
    }
    axios.get("http://106.15.196.78:8080/azyz/demo/getMine", {  // 上线
    // axios.get("/azyz/demo/getMine", { // 开发
      params: {
        requestdata: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(requestdata)))
      }
    })
    .then(
      result => {
        if ( "成功" === result.data.message ) {
          this.setState({
            demoList: result.data.data.demos,
          });
        }
      }
    )
    .catch(
      e => e
    )

  }

  render() {
    const listData = [];
    for (var i = 0; i < this.state.demoList.length; i++) {
    listData.push({
        index: i,
        demoId: this.state.demoList[i].demoId,
        apkLength: this.state.demoList[i].apkLength,
        downsize: this.state.demoList[i].downsize,
        versionName: this.state.demoList[i].versionName,
        href: 'http://ant.design',
        title: this.state.demoList[i].demoName,
        avatar: this.state.demoList[i].demoIcon,
        description: "s",
        content: this.state.demoList[i].info,
    });
    }

  /* Modal对话框 */
    const confirm = Modal.confirm; // 使用 confirm() 可以快捷地弹出确认框,不用调用</Modal>

    const showConfirm = item => {
      confirm({
        title: '你要编辑这个项目吗?',
        centered: true,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          var pathname = this.props.location.pathname
          
        /* 获取项目详情 */
          var requestdata = {
            demoId: item.demoId,
            userId: JSON.parse( localStorage.getItem("userInfo") ).data.userid,
            token: JSON.parse( localStorage.getItem("userInfo") ).data.token
          }
          axios.get("http://106.15.196.78:8080/azyz/demo/getInfo", {  // 上线
          // axios.get('/azyz/demo/getInfo', { // 开发
              params: {
                requestdata: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(requestdata)))
              }
            })
            .then(
              result => {
                console.log(result)
                  if ("成功" === result.data.message) {
                    this.props.getInfo(result.data.data);  // 将项目详情存储到store
                    this.props.history.push({ pathname: "/azyz/work/edit", state: pathname});
                  } else {
                    message.error(result.data.message)
                  }
                }
            )
            .catch()
        /* 获取项目详情 */
        },
        onCancel: () => {},
      });
    }

    const showDeleteConfirm = item => {
      confirm({
        title: '你确定要删除吗?删除之后不可恢复！',
        centered: true,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          console.log(item.demoId);
          const requestdata = {
            demoId: item.demoId,
            userId: this.state.userId,
            token: this.state.token
          }
          if (item) {
            axios({
              method: "post", 
              // url: '/azyz/demo/delete', // 开发
              url: 'http://106.15.196.78:8080/azyz/demo/delete',// 上线
              data: "requestdata=" + JSON.stringify(requestdata),
            })
            .then(
              (res) => {
                if ("删除成功" === res.data.message) {
                  var newDemoList = [...this.state.demoList]; // 服务器删除成功后对列表操作，不用再ajax请求更新列表
                  newDemoList.splice(item.index, 1);
                  this.setState({
                    demoList: newDemoList,
                  }, () => { message.success("删除成功！！"); });
                } else {
                  message.error("删除失败");
                }
              }
            )
            .catch(e => e)
          }
        },
        onCancel: () => {},
      });
    }
  /* Modal对话框 */

  const getInfo = item => {  // 点击查看详情
    var pathname = this.props.location.pathname;
    console.log(this.state.userId)
    if (localStorage.getItem("userInfo") !== null ) { // 另一个页面也登录退出
      /* 获取项目详情 */
      var requestdata = {
        demoId: item.demoId,
        userId: JSON.parse( localStorage.getItem("userInfo") ).data.userid,
        token: JSON.parse( localStorage.getItem("userInfo") ).data.token
      }
      axios.get("http://106.15.196.78:8080/azyz/demo/getInfo", {  // 上线
      // axios.get('/azyz/demo/getInfo', { // 开发
          params: {
            requestdata: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(requestdata)))
          }
        })
        .then(
          result => {
              if ("成功" === result.data.message) {
                sessionStorage.setItem("myProInfo", JSON.stringify(result.data.data));  // 将项目详情存储到sessionStorage, 如果存到sotre,刷新不会点击我的详情,数据传不过去
                this.props.history.push({ pathname: "/work/getinfo", state: pathname});
              } else {
                message.error(result.data.message)
              }
            }
        )
        .catch()
    /* 获取项目详情 */
    } else {
      message.info("您还未登录,请登录后查看详情!")
    }
  }
    
    return (
      <List
        style={{padding: "0"}}
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: page => { // 页数改变
            this.setState({
              page: page,
            })
            console.log(page);
          },
          pageSize: this.state.size,
        }}
        dataSource={listData}
        renderItem={ item => (
          <List.Item
            key={item.demoId}
            actions={[
              <Button type="primary" ghost icon="edit" onClick={() => { showConfirm(item) } }>编辑</Button>, 
              <Button type="danger" ghost icon="delete" onClick={() => { showDeleteConfirm(item)}}>删除</Button>
            ]}
            extra={ <Button type="primary" onClick={() => { getInfo(item)}} >查看详情</Button> }
          >
            <List.Item.Meta
              avatar={<Avatar size={96} shape={"square"} src={item.avatar}> </Avatar>}  // 列表元素的图标
              title={<a style={{color: "#40a9ff"}} href={item.href}>{item.title}</a>}  // 列表元素的标题
              description={<div style={{color: "#1A1A1A"}}>
                <Row>
                  <Col span={8}> <span>大小: {(item.apkLength / 1024 /1024).toFixed(2) + "M"}</span> </Col>
                  <Col span={8}> <span>下载量: {item.downsize}</span> </Col>
                  <Col span={8}> <span>版本: V{item.versionName}</span> </Col>
                </Row> 
                <Row style={{padding: "5px 0"}}>
                  <span>{item.content}</span>
                </Row>
                </div>}  // 列表元素的描述内容
              alt={"显示错误"}
              onError={ (e) => e }
            />
          </List.Item>
        )}
      />
    );
  }
}

// 数据组件
// state表示store中combineReducers中参数对象, state.myProInfo就拿到了myProReducer中state的初始值
function mapStateToProps(state) {  //获取状态
  return {
    myProInfo : state.myProInfo
  }; 
}
function mapDispathchToProps(dispatch) { // 派发任务
  return {
    getInfo(data) {
      dispatch({ type: 'GET_PRO_INFO', payload: data });
    }
  };
}

// 高阶组件,将UI组建和数据组件分离
var MyPro = connect(mapStateToProps, mapDispathchToProps)(MyProUI);

export default MyPro;
