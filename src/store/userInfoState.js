// 获取用户信息
const userInfoState = {
    data:{
        headImage: "",
        id: null,
        nickname: "",
        openId: "",
        preLoginTime: null,
        preLoginTimeString: "",
        token: "",
        userid: "",
    },
    message: "",
    status: null,
};
function userInfoReducer(state = localStorage.getItem("userInfo") ? JSON.parse( localStorage.getItem("userInfo") ) : userInfoState , action) {
    if (action.type === 'SET_USER_INFO') {
        var cloneState = action.payload
        return cloneState;
    }
    else {
        return state
    }
}

export default userInfoReducer;