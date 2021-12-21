const defaultState ={
    userAuth: {},
}

const USER_DATA_AUTH = "USER_DATA_AUTH"

export const userAuthReducer = (state = defaultState, action) => {
    switch (action.type) {
        case USER_DATA_AUTH:
            return {...state, userAuth: action.payload}
        default:
            return state
    }
}

export const userAuthAction = (payload) => ({type: USER_DATA_AUTH, payload})