function searchReducer(state = {}, action) {
    if (action.type === 'GET_SEARCH_DATE') { 
        return action.payload;
    } else {
        return state
    }
}

export default searchReducer;