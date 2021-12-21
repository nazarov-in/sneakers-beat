const defaultState = {
    allGoods: [],
    branded: 'All'
}

const ALL_GOODS = "ALL_GOODS"
const GOODS_FILTER_BRANDED = "GOODS_FILTER_BRANDED"

export const goodsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case ALL_GOODS:
            return {...state, allGoods: action.payload}
        case GOODS_FILTER_BRANDED:
            return {...state, branded: action.payload}
        default:
            return state
    }
}

export const allGoodsAction = (payload) => ({type: ALL_GOODS, payload})
export const filterBrandedAction = (payload) => ({type: GOODS_FILTER_BRANDED, payload})