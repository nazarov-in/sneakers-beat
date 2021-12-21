import React from 'react'
import {useSelector} from "react-redux"

export const useCart = () => {
    const contents = useSelector(state => state.basket.contents)
    const totalPrice = contents.reduce((sum, obj) => obj.price + sum, 0)

    return {totalPrice}
}

export const useBreakNumber = (totalPrice) => {
    const number = totalPrice
    const cost = String(number).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, "$1 ")

    return {cost}
}