// 获取work中sider选中的menu的key值,从localStorage中获取
function workSelectReducer(state = sessionStorage.getItem("selectKey"), action) {
    if( action.type === 'GET_MENU_KEY' ) {
        var cloneState = action.payload;
        return cloneState;
    }else {
        return state;
    }
}

export default workSelectReducer