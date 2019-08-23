import React, {Fragment} from 'react';
import { connect } from "react-redux";
import QRCode from 'qrcode'
import "./static/myapp.less"

class MyAppUI extends React.Component {

  constructor(){
    super();
    this.state = {
        url: ""
    }
}

  componentDidMount () {
    QRCode.toDataURL('I am a pony!', { errorCorrectionLevel: 'H', version: 5})
    .then(url => {
        // console.log(url)
        this.setState({
            url
        })
    })
    .catch(err => {
        console.error(err)
    })
}
  
  render() {
    return (
      <Fragment>
        {/* 标题 */}
        <div id="myappTitle" style={{ margin: 30, padding: 12 }}>
          我的项目
        </div>

        <div id="myappcontent" style={{ padding: 24, background: '#fff', minHeight: 650 }}>
          Bill is a cat.<br/>
          <ul onClick={this.props.test1}>
            {this.props.test.map( (item, index) => {
              return <li key={index}>{item}</li>
            } )}
          </ul>
        </div>

        <div>
                <div id="canvas">market</div>
                <img src={this.state.url} alt=""/>
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