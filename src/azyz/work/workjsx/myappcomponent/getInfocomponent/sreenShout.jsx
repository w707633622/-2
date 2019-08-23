import React from 'react';
import { List } from 'antd';
import '../../static/addcomponent/screenShotUpload.less'

class ScreenShot extends React.Component {
constructor() {
    super();
    this.state = {
        imageList: [], // 图片下载地址
        visible: false,
    };
}

componentDidMount() {
    var f = JSON.stringify(this.props.myProInfo)
        if (f !== '{}') {
            this.setState({
                imageList: this.props.myProInfo.demo.imageList,
            })
        }
}

render() {
    return (
        <List
            grid={{ gutter: 300, column: 4 }}
            dataSource={this.state.imageList}
            renderItem={item => (
            <List.Item>
                <img style={{ width: "300px", height: "520px" }} src={item} alt=""/>
            </List.Item>
            )}
        />
    )
}     
}

export default ScreenShot;