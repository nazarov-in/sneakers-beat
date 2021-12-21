import React, {useEffect, useRef, useState} from 'react'
import {
    collection, setDoc, deleteDoc, getDocs,
    where, onSnapshot, query, doc
} from "firebase/firestore"
import {contentsBasketAction} from "../../reducers/basketReducer"
import {containsFavoritesAction} from "../../reducers/favoritesReducer"
import {useDispatch, useSelector} from "react-redux"
import {allGoodsAction, filterBrandedAction} from "../../reducers/goodsReducer"
import {db} from "../../firebase"

import Sliders from "../sliders"
import Search from "../search"
import Card from "../card"
import Filtration from "../filtration"
import styles from './Sneakers.module.scss'

const Sneakers = () => {
    const [inLoading, setIsLoading] = useState(false)
    const [cleanupFunc, setCleanupFunc] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const userId = useSelector(state => state.userAuth.userAuth.id)
    const goods = useSelector(state => state.allGoods.allGoods)
    const basket = useSelector(state => state.basket.contents)
    const favorites = useSelector(state => state.favorites.contains)
    const dispatch = useDispatch()
    const selectButton = useRef('All')
    const refScroll = useRef(null)
    const selectSex = useRef('any')

    useEffect(() => {
        setCleanupFunc(false)

        const handlerData = async () => {
            setIsLoading(false)
            await getListBasket()
            await getListFavorites()
            await getGoodsInAllSneakers()
            setIsLoading(true)
        }

        handlerData()

        return () => setCleanupFunc(true)
    }, [])

    const getListBasket = async () => {
        const q = query(collection(db, 'users', userId, 'basket'))
        await onSnapshot(q, (snapshot) => {
            const events = []
            snapshot.forEach((doc) => {
                events.push(doc.data())
            })

            if(!cleanupFunc) dispatch(contentsBasketAction(events))
        })
    }

    const getListFavorites = async () => {
        const q = query(collection(db, 'users', userId, 'liked'))
        await onSnapshot(q, (snapshot) => {
            const events = []
            snapshot.forEach((doc) => {
                events.push(doc.data())
            })

            if(!cleanupFunc) dispatch(containsFavoritesAction(events))
        })
    }

    const getGoodsInAllSneakers = async () => {
        const data = []
        await onSnapshot(collection(db, "all-sneakers"), (snapshot) => {
            snapshot.docs.map(doc => {
                data.push(Object.assign(doc.data(), {id: doc.id}))
            })
            dispatch(allGoodsAction(data))
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
            const querySnapshot = await getDocs(refMatches)

            if (querySnapshot.docs.length > 0) {
                await querySnapshot.docs.map(doc => deleteDoc(doc.ref))
            } else await setDoc(refDoc, item)

        } catch (e) {console.error('Error adding document: ', e)}
    }

    const addedBasket = (id) => {
        return basket.some(obj => obj.id === id)
    }

    const clickToCollection = async (e) => {
        window.scrollTo({ behavior: 'smooth', top: refScroll.current.offsetTop })
        const name = e.target.name
        const data = []

        // remove all active classes and add a new one
        const list = selectButton.current.childNodes
        list.forEach(btn => btn.classList.remove('active'))
        list.forEach(btn => btn.name === name ? btn.classList.add('active') : null)
        dispatch(filterBrandedAction(name))

        const sex = selectSex.current.props.value.value
        let refMatches = []

        try {
            const colRef = collection(db, `all-sneakers`)
            if (sex === 'any') refMatches = query(colRef, where('branded', "==", name))
            else refMatches = query(colRef, where('branded', "==", name), where('sex', "==", sex))
            const querySnapshot = await getDocs(refMatches)

            await querySnapshot.docs.map(doc => {
                data.push(Object.assign(doc.data(), {id: doc.id}))
            })

            dispatch(allGoodsAction(data))
        } catch (e) {console.error('Error adding document: ', e)}
    }

    return (
        <div className={styles.sneakersWrapper}>
            <Sliders handlerClick={clickToCollection}/>
            <div ref={refScroll}>
                <Filtration selectButton={selectButton} selectSex={selectSex}/>
            </div>
            <div className={`${styles.sneakersTitle} d-flex space-between align-center`}>
                <h2>{searchValue ? `Поиск по запросу: ${searchValue}` : 'Все кроссовки'}</h2>
                <Search
                    setSearchValue={setSearchValue}
                    searchValue={searchValue}
                />
            </div>
            <div className={styles.sneakersAll}>
                {goods
                    .filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase()))
                    .map(good => (
                    <Card
                        key={good.id}
                        title={good.title}
                        image={good.image}
                        price={good.price}
                        addCartItem={() => addCartItem(good)}
                        addedBasket={addedBasket(good.id)}
                        addedFavorites={favorites.some(obj => obj.id === good.id)}
                        addCardFromFavorites={() => addCardFromFavorites(good)}
                        good={good}
                    />
                ))}
            </div>
        </div>
    )
}

export default Sneakers