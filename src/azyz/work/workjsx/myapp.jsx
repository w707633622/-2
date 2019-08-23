import React, {Fragment} from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MyPro from "./myappcomponent/mypro";
import "./static/myapp.less";

var MyProWith = withRouter(MyPro);

class MyAppUI extends React.Component {
  
  render() {
    return (
      <Fragment>
        {/* 标题 */}
        <div id="myappTitle" style={{ margin: 30, padding: 12 }}>
          我的项目
        </div>
        <div id="myappcontent" style={{ padding: 24, background: '#fff', minHeight: 650 }}>
          <MyProWith></MyProWith>
        </div>
      </Fragment>
    );
  }
  
}

// 数据组件
// state表示store中combineReducers中参数对象, state.test就拿到了testReducer中state的初始值
function mapStateToProps(state) {  //获取状态
  return {
    test : state.test
  }; 
}
function mapDispathchToProps(dispatch) { // 派发任务
  return {
    test1() {
      dispatch({ type: 'TEST_NAME', payload: [333, 8989] });
    }
  };
}

// 高阶组件,将UI组建和数据组件分离
var MyApp = connect(mapStateToProps, mapDispathchToProps)(MyAppUI);

export default MyApp;