import React from 'react';

import { Layout } from 'antd';

class Body extends React.Component {
  

  render() {
    return (
      <Layout>
        <Layout.Sider style={{
          overflow: 'auto', height: '100vh', position: 'fixed', left: 0,
        }}
        >
          
        </Layout.Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Layout.Header style={{ background: '#fff', padding: 0 }} />
          <Layout.Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            
          </Layout.Content>
          <Layout.Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Layout.Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Body;