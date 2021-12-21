const defaultState = {
    show: false,
    contents: []
}

const BASKET_SHOW = "BASKET_SHOW"
const BASKET_CONTENTS = "BASKET_CONTENTS"

export const basketReducer = (state = defaultState, action) => {
    switch (action.type) {
        case BASKET_SHOW:
            return {...state, show: action.payload}
        case BASKET_CONTENTS:
            return {...state, contents: action.payload}
        default:
            return state
    }
}

export const showBasketAction = (payload) => ({type: BASKET_SHOW, payload})
export const contentsBasketAction = (payload) => ({type: BASKET_CONTENTS, payload})