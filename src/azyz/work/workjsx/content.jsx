import React, {Fragment} from 'react';

import { Breadcrumb } from 'antd';

class Content extends React.Component {
  

  render() {
    return (
      <Fragment>
        <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>User</Breadcrumb.Item>
        <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
          Bill is a cat.<br/>
          Bill is a cat.<br/>
          Bill is a cat.<br/>
          Bill is a cat.<br/>
          Bill is a cat.<br/>
          Bill is a cat.<br/>
          Bill is a cat.<br/>
          Bill is a cat.<br/>
          Bill is a cat.<br/>
          Bill is a cat.<br/>
          Bill is a cat.<br/>
          Bill is a cat.<br/>
          Bill is a cat.<br/>
          Bill is a cat.<br/>
          Bill is a cat.<br/>
          Bill is a cat.<br/>
          Bill is a cat.<br/>
        </div>
      </Fragment>
    );
  }
}

export default Content;