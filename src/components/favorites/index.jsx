import React, {useEffect, useState} from 'react'
import {
    collection, deleteDoc, doc, getDocs, onSnapshot,
    query, setDoc, where
} from "firebase/firestore"
import {containsFavoritesAction} from "../../reducers/favoritesReducer"
import {contentsBasketAction} from "../../reducers/basketReducer"
import {useDispatch, useSelector} from "react-redux"
import {Link} from "react-router-dom"
import {db} from "../../firebase"

import Card from "../card"
import styles from './Favorites.module.scss'

const Favorites = () => {
    const dispatch = useDispatch()
    const [inLoading, setIsLoading] = useState(false)
    const [cleanupFunc, setCleanupFunc] = useState(false)
    const userId = useSelector(state => state.userAuth.userAuth.id)
    const contains = useSelector(state => state.favorites.contains)
    const basket = useSelector(state => state.basket.contents)
    const favorites = useSelector(state => state.favorites.contains)

    useEffect(() => {
        setCleanupFunc(false)

        const getData = async () => {
            setIsLoading(false)
            await getListBasket()
            await getListFavorites()
            setIsLoading(true)
        }

        getData()

        return () => setCleanupFunc(true)
    }, [])

    const getListBasket = async () => {
        const q = query(collection(db, 'users', userId, 'basket'))
        await onSnapshot(q, (snapshot) => {
            const events = []
            snapshot.forEach((doc) => events.push(doc.data()))

            if(!cleanupFunc) dispatch(contentsBasketAction(events))
        })
    }

    const getListFavorites = async () => {
        const q = query(collection(db, 'users', userId, 'liked'))
        await onSnapshot(q, (snapshot) => {
            const events = []
            snapshot.forEach((doc) => events.push(doc.data()))

            if(!cleanupFunc) dispatch(containsFavoritesAction(events))
        })
    }

    const addCardFromFavorites = async (item) => {
        try {
            const refDoc = doc(collection(db, 'users', userId, 'liked'))
            const refMatches = query(collection(db, `users/${userId}/liked/`), where('id', '==', item.id))
            const querySnapshot = await getDocs(refMatches)

            if (querySnapshot.docs.length > 0) {
                await querySnapshot.docs.map(doc => deleteDoc(doc.ref))
            } else await setDoc(refDoc, item)

        } catch (e) {console.error('Error adding document: ', e)}
    }

    const addCartItem = async (item) => {
        try {
            const refDoc = doc(collection(db, 'users', userId, 'basket'))
            const refMatches = query(collection(db, `users/${userId}/basket/`), where('id', '==', item.id))
            const snapshot = await getDocs(refMatches)

            if (snapshot.docs.length > 0) {
                await snapshot.docs.map(doc => deleteDoc(doc.ref))
            } else await setDoc(refDoc, item)

        } catch (e) {console.error('Error adding document: ', e)}
    }

    return (
        <div className={styles.favoritesWrapper}>
            {favorites.length !== 0 ? (
                <>
                    <div className={styles.favoritesTitle}>
                        <Link to={'/'}><img src="/image/favorites-back.svg" alt="back"/></Link>
                        <h2>Мои закладки</h2>
                    </div>
                    <div className={styles.favoritesCardWrapper}>
                        {contains.map(obj => (
                            <Card
                                key={obj.id}
                                title={obj.title}
                                image={obj.image}
                                price={obj.price}
                                addedFavorites
                                addCartItem={() => addCartItem(obj)}
                                addedBasket={basket.some(item => item.id === obj.id)}
                                addCardFromFavorites={() => addCardFromFavorites(obj)}
                                good={obj}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className={styles.favoritesEmpty}>
                    <img src="/image/favorites-empty.svg" alt="smile"/>
                    <h3>Закладок нет :(</h3>
                    <p>Вы ничего не добавляли в закладки</p>
                    <Link to={'/'} className={styles.btnGreen}>
                        <img src="/image/arrow.svg" alt="arrow"/>
                        Вернуться назад
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Favorites