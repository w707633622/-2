import React, {Fragment} from 'react';
import { Row, Col, List, Avatar, Button, message } from 'antd';
import axios from "axios";
import CryptoJS from "crypto-js";
import "./mylike.css";

class MyLike extends React.Component {

constructor() {
    super();
    this.state = {
        pager: 0, // 当前页
        size: 3, // 每页显示项目数
        userId: JSON.parse( localStorage.getItem("userInfo") ).data.userid,
        token: JSON.parse(localStorage.getItem("userInfo")).data.token,

        demoList: [],
    }
    this.listData = [];
    }

componentDidMount() {
    var requestdata = {
        pager: this.state.pager,
        userId: this.state.userId,
      }
      axios.get("http://106.15.196.78:8080/azyz/demo/getLike", {  // 上线
      // axios.get("/azyz/demo/getLike", { // 开发
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

  const getInfo = item => {  // 点击查看详情
    var pathname = this.props.location.pathname;
    /* 获取我的收藏 */
    var requestdata = {
      demoId: item.demoId,
      userId: JSON.parse( localStorage.getItem("userInfo") ).data.userid,
      token: JSON.parse( localStorage.getItem("userInfo") ).data.token
    }
    axios.get("http://106.15.196.78:8080/azyz/demo/getInfo", {  // 上线
    // axios.get('/azyz/demo/getInfo', { //开发
        params: {
          requestdata: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(requestdata)))
        }
      })
      .then(
        result => {
            if ("成功" === result.data.message) {
              sessionStorage.setItem("myProInfo", JSON.stringify(result.data.data));  // 将项目详情存储到sessionStorage, 如果存到sotre,刷新不会点击我的详情,数据传不过去
              this.props.history.push({ pathname: "/azyz/work/getinfo", state: pathname});
            } else {
              message.error(result.data.message)
            }
          }
      )
      .catch()
  /* 获取我的收藏 */
  }
    return (
    //    <Empty
    //    description={"您还没有收藏，看市场上去看看吧！！"}
    //    >
    //        {/* <Button onClick={this.handelGoMarket} type="primary">去市场</Button> */}
    //    </Empty>

    <Fragment>
    {/* 标题 */}
    <div id="myappTitle" style={{ margin: 30, padding: 12 }}>
      我的收藏
    </div>
    <div id="myappcontent" style={{ padding: 24, background: '#fff', minHeight: 650 }}>
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
    </div>
  </Fragment>
    )
}
// handelGoMarket = () => {
//     this.props.history.push("/azyz/work/market", this.props.location.pathname)
//     store.dispatch({type: 'GET_MENU_KEY', payload: "marketkey"})
//     sessionStorage.setItem("selectKey", "marketkey") // 跳转到market页面，将点击转为marketkey
//     window.location.reload() // 将点击效果刷新一遍
// } 
}

export default MyLike;