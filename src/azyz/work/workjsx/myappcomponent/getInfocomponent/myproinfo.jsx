import React from "react";
import { Row, Col, List, Avatar, Icon, Button, message } from 'antd';
import axios from "axios";
import "../mypro.css"; // 使用mypro模板

class MyPro extends React.Component {
  constructor(props) {
    super();
    this.state = {
      pager: 0, // 当前页
      page: 0, // 当前页
      size: 3, // 每页显示项目数
      userId: localStorage.getItem("userInfo") ? JSON.parse( localStorage.getItem("userInfo") ).data.userid : null,
      token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).data.token : null,

      demoList: props.myProInfo.demo,
      isLike: props.myProInfo.isLike,

      apkLength: 0, // 大小
      count: 0, // 下载次数
      versionName: "", // 版本

      listData: [{
        index: 0,
        demoId: props.myProInfo.demo.demoId,
        apkLength: props.myProInfo.demo.apkLength,
        downsize: props.myProInfo.demo.downsize,
        versionName: props.myProInfo.demo.versionName,
        href: 'http://ant.design',
        title: props.myProInfo.demo.demoName,
        avatar: props.myProInfo.demo.demoIcon,
        description: "s",
        content: props.myProInfo.demo.info,
      }],
    }
  }

  handelIsLike = (a) => {  // 收藏 或者 取消收藏
    console.log(a)
    var requestdata = {
      demoId: this.state.demoList.demoId,
      userId: this.state.userId,
      token: this.state.token,
      type: this.state.isLike === false ? 1 : 0,  // 1添加收藏 0取消收藏
    }

  axios({
    method: 'post',
    // url: '/azyz/demo/like', // 开发
    url: 'http://106.15.196.78:8080/azyz/demo/like',// 上线
    data: "requestdata="+ JSON.stringify(requestdata)
  })
  .then(
      // (res) => { console.log(res) }
      (res) => {
          if( "收藏成功" === res.data.message ) {
            message.success("收藏成功！！")
            this.setState({
              isLike: res.data.data,
            })
          } else if ( "取消收藏成功" === res.data.message ) {
            message.success("取消收藏！！")
            this.setState({
              isLike: res.data.data,
            })
          } else if ( "数据错误" === res.data.message && 1004 === res.data.status ) {
            message.info( "您还未登录，请登录后收藏" );
          } else if ("已经收藏" === res.data.message && 7001 === res.data.status ) {
            message.info("您已经收藏了次项目，请到我的收藏查看");
          }
       }
      )
  .catch( e => e )

  }

  render() {
    return (
      <List
        style={{padding: "0"}}
        itemLayout="vertical"
        pagination={false} // 分页
        dataSource={this.state.listData}
        renderItem={ item => (
          <List.Item
            key={item.demoId}
            extra={
            <Button
              type="link"
              style={{color: "#FF8C00", borderColor:"#FF8C00"}}
                onClick={() => { this.handelIsLike(item) } }
              >
                {this.state.isLike === false ? <Icon type="heart" /> : <Icon type="heart" theme="filled" />}
                {this.state.isLike === false ? "收藏" : "取消收藏"}
            </Button> }
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

export default MyPro;
