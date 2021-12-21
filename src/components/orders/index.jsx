import React, {useEffect, useState} from 'react'
import {collection, onSnapshot, query} from "firebase/firestore"
import {useSelector} from "react-redux"
import {Link} from "react-router-dom"
import {db} from "../../firebase"

import Card from "../card"
import styles from '../favorites/Favorites.module.scss'

const Orders = () => {
    const userId = useSelector(state => state.userAuth.userAuth.id)
    const [cleanupFunc, setCleanupFunc] = useState(false)
    const [orders, setOrders] = useState([])

    useEffect(() => {
        setCleanupFunc(false)

        getDataFromOrder()

        return () => setCleanupFunc(true)
    }, [])

    const getDataFromOrder = async () => {
        const q = query(collection(db, 'users', userId, 'orders'))
        await onSnapshot(q, (snapshot) => {
            const events = []
            snapshot.forEach((doc) => {
                events.push(Object.assign(doc.data(), {id: doc.id}))
            })

            if(!cleanupFunc) setOrders(events)
        })
    }

    return (
        <div className={styles.favoritesWrapper}>
            {orders.length !== 0 ? (
                <>
                    <div className={styles.favoritesTitle}>
                        <Link to={'/'}><img src="/image/favorites-back.svg" alt="back"/></Link>
                        <h2>Мои покупки</h2>
                    </div>
                    <div className={styles.favoritesCardWrapper}>
                        {orders.map(order => (
                            <Card
                                key={order.id}
                                title={order.title}
                                image={order.image}
                                price={order.price}
                                good={order}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className={styles.favoritesEmpty}>
                    <img src="/image/empty-order.svg" alt="smile"/>
                    <h3>У вас нет заказов</h3>
                    <p>Вы нищеброд? Оформите хотя бы один заказ.</p>
                    <Link to={'/'} className={styles.btnGreen}>
                        <img src="/image/arrow.svg" alt="arrow"/>
                        Вернуться назад
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Orders