function myProReducer(state = {}, action) {
    if (action.type === 'GET_PRO_INFO') { 
        return action.payload;
    } else if (action.type === 'CLER_DATA') {
        return action.payload;
    }
    else {
        return state
    }
}

export default myProReducer;