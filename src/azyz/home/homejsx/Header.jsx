import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Menu, Row, Col, Icon, Popover } from 'antd';
import { Link, withRouter } from 'react-router-dom';

import Login from '../../../commonjsx/login';

const searchEngine = 'Google';

const LoginWith = withRouter(Login);

export default class Header extends React.Component {
  
  static propTypes = {
    isFirstScreen: PropTypes.bool,
    isMobile: PropTypes.bool,
  }
  state = {
    menuVisible: false,
    user : {
      name: "sssdd"
    }
  };

  onMenuVisibleChange = (visible) => {
    this.setState({
      menuVisible: visible,
    });
  }
  handleShowMenu = () => {
    this.setState({
      menuVisible: true,
    });
  }

  handleHideMenu = () => {
    this.setState({
      menuVisible: false,
    });
  }

  handleSelectFilter = (value, option) => {
    const optionValue = option.props['data-label'];
    return optionValue === searchEngine ||
      optionValue.indexOf(value.toLowerCase()) > -1;
  }

  clickHome = () => {
    console.log(123)
  }

  render() {
    const { isFirstScreen, isMobile } = this.props;
    const { menuVisible } = this.state;
    const menuMode = isMobile ? 'inline' : 'horizontal';
    const headerClassName = classNames({
      clearfix: true,
      'home-nav-white': !isFirstScreen,
    });
    
    const menu = [
      <Menu mode={menuMode} defaultSelectedKeys={['home']} id="nav" key="nav">
       
        <Menu.Item key="home" onClick={this.clickHome}>
          <Link to="/azyz/home">
            首页
          </Link>
        </Menu.Item>
        <Menu.Item key="work">
          <Link to="/azyz/work">
            项目
          </Link>
        </Menu.Item>
        {/* <Menu.Item key="docs/react">
          组件
        </Menu.Item> */}
  
        {/* 用户头像框,鼠标hover后显示 this.state.dropDownmenu */}
        <Menu.Item key="pro">
          <LoginWith></LoginWith>
        </Menu.Item>

      </Menu>,
    ];

    return (
      <header id="header" className={headerClassName}>
        {menuMode === 'inline' ? (
          <Popover
            overlayClassName="popover-menu"
            placement="bottomRight"
            content={menu}
            trigger="click"
            visible={menuVisible}
            arrowPointAtCenter
            onVisibleChange={this.onMenuVisibleChange}
          >
            <Icon
              className="nav-phone-icon"
              type="bars"
              onClick={this.handleShowMenu}
            />
          </Popover>
        ) : null}
        <Row>
          <Col lg={4} md={5} sm={24} xs={24}>
            <a id="logo" href="http://www.baidu.com">
              <img alt="logo" src={require("./static/img/logo.png")}
              style={{
                height: 30,
                lineHeight: 80,
                width: 40,
                marginRight: 8
              }}
              />
              <span>安卓驿站</span>
            </a>
          </Col>
          <Col lg={20} md={19} sm={0} xs={0}>
            {menuMode === 'horizontal' ? menu : null}
          </Col>
        </Row>
      </header>
    );
  }
}
