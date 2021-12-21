import {createStore, combineReducers} from 'redux'
import {userAuthReducer} from '../reducers/userAuthReducer'
import {goodsReducer} from '../reducers/goodsReducer'
import {basketReducer} from '../reducers/basketReducer'
import {favoritesReducer} from '../reducers/favoritesReducer'

const rootReducer = combineReducers({
    userAuth: userAuthReducer,
    allGoods: goodsReducer,
    basket: basketReducer,
    favorites: favoritesReducer,
})

export const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )