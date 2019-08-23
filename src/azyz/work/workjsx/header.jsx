import React from 'react';
import { Menu, Row, Input, Col  } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import axios from "axios";
import CryptoJS from "crypto-js";
import store from "../../../store/store";

import Login from '../../../commonjsx/login';

var LoginWith = withRouter(Login);

class Header extends React.Component {

  onSearch = (value) => {
    console.log(value)
    var requestdata = {
      lickStr: value, // 	搜索内容
    }
    axios.get("http://106.15.196.78:8080/azyz/demo/searchPage", { // 上线
    // axios.get("/azyz/demo/searchPage", { // 开发
      params: {
        requestdata: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(requestdata)))
      }
    })
    .then( result => {
      console.log(this.props)
      if("成功" === result.data.message) {
        store.dispatch({ type: 'GET_SEARCH_DATE', payload: result.data.data.demos })

        sessionStorage.setItem("selectKey", "marketkey") // 保存item的key
        store.dispatch({ type: 'GET_MENU_KEY', payload: "marketkey" })

        this.props.history.push("/azyz/work/market", "fromSearch")
      }
    })
    .catch(
      e => e
    )
  }
  
  render() {
    console.log(this.props)
    return(
      <Row type="flex" justify="end">
        {/* 搜索栏 */}
        <Col span={8}>
          <Input.Search
            placeholder="市场查找"
            onSearch={this.onSearch}
            style={{ width: 250 }}
          />
        </Col>

        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">
            <Link to="/azyz/home">首页</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/azyz/work">项目</Link>
          </Menu.Item>
          {/* <Menu.Item key="3">nav 3</Menu.Item> */}

          {/* 用户头像框,鼠标hover后显示 this.state.dropDownmenu */}
          <Menu.Item key="user">
            <LoginWith></LoginWith>
          </Menu.Item>
        </Menu>
      </Row>
    );
  }
}

export default Header;