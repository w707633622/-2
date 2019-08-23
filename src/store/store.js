import { createStore, combineReducers } from 'redux';
import userInfoReducer from "./userInfoState";
import workSelectReducer from "./workSelectState";
import myProReducer from "./myproState";
import searchReducer from "./searchState";

function  testReducer(state = [111, 222], action) {
    if( action.type === 'TEST_NAME' ) {
        var cloneState = [...state].concat(action.payload);
        return cloneState;
    }
    else {
        return state;
    }
}

var reducers = combineReducers({
    test : testReducer,
    userInfo: userInfoReducer,
    workSelectKey: workSelectReducer,
    myProInfo: myProReducer,
    serchDate: searchReducer,
})

var store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;

// store已经在index中用provider组件在全局中生效  React-redux功能