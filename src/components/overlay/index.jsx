import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {showBasketAction} from "../../reducers/basketReducer"
import {collection, deleteDoc, doc, getDocs, query, setDoc} from "firebase/firestore"
import {useBreakNumber, useCart} from "../../hooks"
import {db} from "../../firebase"

import OverlayInfo from "../overlay-info"
import OverlayCard from "../overlay-card"
import styles from './Overlay.module.scss'

const Overlay = () => {
    const dispatch = useDispatch()
    const showBasket = useSelector(state => state.basket.show)
    const userId = useSelector(state => state.userAuth.userAuth.id)
    const contents = useSelector(state => state.basket.contents)
    const [orderProcessed, setOrderProcessed] = useState(false)
    const {totalPrice} = useCart()
    const {cost} = useBreakNumber(totalPrice)

    const sumFix = Math.round(totalPrice / 100 * 5)
    const {cost: costTax} = useBreakNumber(sumFix)


    useEffect(() => {}, [contents])

    const closeBasket = () => {
        dispatch(showBasketAction(!showBasket))
        setOrderProcessed(false)
    }

    const removeCardFromBasket = async (item) => {
        const docsSnap = await getDocs(collection(db,`users/${userId}/basket`))
        docsSnap.forEach((doc) => {
            if(item.id === doc.data().id) deleteDoc(doc.ref)
        })
    }

    const addDataFromOrder = async () => {
        try {
            // Add goods from database in orders
            await contents.forEach(item => {
                const refDoc = doc(collection(db, 'users', userId, 'orders'))
                setDoc(refDoc, item)
            })

            // Delete goods from database in basket
            const refCol = query(collection(db, 'users', userId, 'basket'))
            const querySnapshot = await getDocs(refCol)
            querySnapshot.docs.map(item => deleteDoc(item.ref))

        } catch (e) {console.error('Error adding document: ', e)}

        setOrderProcessed(true)
    }

    return (
        <div className={styles.basketOverlay} style={{display: !showBasket ? 'none' : 'block'}}>
            <div className={`${styles.basketWrapper} d-flex`}>
                <div className={`${styles.basketTitleClose} d-flex space-between align-center`}>
                    <h2>Корзина</h2>
                    <img
                        className={styles.basketCartRemove}
                        src="/image/btn-remove.svg"
                        alt="remove"
                        onClick={closeBasket}
                    />
                </div>
                <div className={styles.basketCartInner}>
                    {contents.length === 0  ? (
                        <div className={styles.basketEmptyWrapp}>
                            {!orderProcessed ? (
                                <OverlayInfo
                                    image={'/image/empty-cart.svg'}
                                    title={'Корзина пустая'}
                                    description={'Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ.'}
                                    closeBasket={closeBasket}
                                />
                            ) : (
                                <OverlayInfo
                                    image={'/image/order-processed.svg'}
                                    title={'Заказ оформлен!'}
                                    description={`Ваш заказ #${682586} скоро будет передан курьерской доставке.`}
                                    closeBasket={closeBasket}
                                    basketEmpty
                                />
                            )}
                        </div>
                    ): (contents.map(content => (
                            <OverlayCard
                                key={content.id}
                                content={content}
                                removeCardFromBasket={removeCardFromBasket}
                            />
                        )))
                    }
                </div>
                {contents.length > 0 ? (
                    <div className={styles.basketPayment}>
                        <ul>
                            <li className="d-flex space-between">
                                <span>Итого: </span>
                                <div></div>
                                <b>{cost} руб.</b>
                            </li>
                            <li className="d-flex space-between">
                                <span>Налог 5%: </span>
                                <div></div>
                                <b>{costTax} руб.</b>
                            </li>
                        </ul>
                        <button className={styles.btnGreen} onClick={addDataFromOrder}>
                            Оформите заказ
                            <img src="/image/arrow.svg" alt="arrow"/>
                        </button>
                    </div>
                ):null}
            </div>
        </div>
    )
}

export default Overlay