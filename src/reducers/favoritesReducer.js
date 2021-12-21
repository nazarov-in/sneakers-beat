const defaultState = {
    contains: [],
}

const FAVORITES_CONTAINS = "FAVORITES_CONTAINS"

export const favoritesReducer = (state = defaultState, action) => {
    switch (action.type) {
        case FAVORITES_CONTAINS:
            return {...state, contains: action.payload}
        default:
            return state
    }
}

export const containsFavoritesAction = (payload) => ({type: FAVORITES_CONTAINS, payload})