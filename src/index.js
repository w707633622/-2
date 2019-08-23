import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './store/store';
import { Provider } from 'react-redux';

// Provider 实现store在全局数据自动渲染，不用每个组件引入， store属性可以让store不用再在各个组件之间引用
ReactDOM.render(<Provider store={store}> <App /> </Provider>, document.getElementById('root'));

