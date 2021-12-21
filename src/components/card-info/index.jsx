import React, {useEffect, useRef, useState} from 'react'
import {collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc, where} from "firebase/firestore"
import {containsFavoritesAction} from "../../reducers/favoritesReducer"
import {contentsBasketAction} from "../../reducers/basketReducer"
import {useDispatch, useSelector} from "react-redux"
import {Link, useParams} from "react-router-dom"
import {db} from "../../firebase"

import CardGallery from "../card-gallery"
import CardContents from "../card-contents"
import styles from './CardInfo.module.scss'

const CardInfo = () => {
    const {id} = useParams()
    const dispatch = useDispatch()
    const userId = useSelector(state => state.userAuth.userAuth.id)
    const basket = useSelector(state => state.basket.contents)
    const favorites = useSelector(state => state.favorites.contains)
    const [product, setProduct] = useState({})
    const [cleanupFunc, setCleanupFunc] = useState(false)
    const [imageActive, setImageActive] = useState('')
    const sizeButton = useRef('')

    useEffect(() => {
        window.scrollTo(0, 0)
        setCleanupFunc(false)

        const handlerData = async () => {
            await getDataFromCard(id)
            await getListBasket()
            await getListFavorites()
        }

        handlerData()

        return () => setCleanupFunc(true)
    }, [])

    const getDataFromCard = async (id) => {
        try {
            const q = query(collection(db, "all-sneakers"))
            const querySnapshot = await getDocs(q)
            querySnapshot.docs.map(doc => {
                if(doc.ref.id === id) {
                    setProduct(doc.data())
                    setImageActive(doc.data().image)
                }
            })
        } catch (e) {console.error('Error adding document: ', e)}
    }

    const getListFavorites = async () => {
        const q = query(collection(db, 'users', userId, 'liked'))
        await onSnapshot(q, (snapshot) => {
            const events = []
            snapshot.forEach((doc) => events.push(doc.data()))

            if(!cleanupFunc) dispatch(containsFavoritesAction(events))
        })
    }

    const getListBasket = async () => {
        const q = query(collection(db, 'users', userId, 'basket'))
        await onSnapshot(q, (snapshot) => {
            const events = []
            snapshot.forEach((doc) => events.push(doc.data()))

            if(!cleanupFunc) dispatch(contentsBasketAction(events))
        })
    }

    const addCardFromFavorites = async () => {
        try {
            const refDoc = doc(collection(db, 'users', userId, 'liked'))
            const refMatches = query(collection(db, `users/${userId}/liked/`), where('id', '==', id))
            const querySnapshot = await getDocs(refMatches)

            if (querySnapshot.docs.length > 0) {
                await querySnapshot.docs.map(doc => deleteDoc(doc.ref))
            } else {
                const item = Object.assign(product, {id})
                await setDoc(refDoc, item)
            }

        } catch (e) {console.error('Error adding document: ', e)}
    }

    const addCardFromBasket = async () => {
        try {
            const refDoc = doc(collection(db, 'users', userId, 'basket'))
            const refMatches = query(collection(db, `users/${userId}/basket/`), where('id', '==', id))
            const querySnapshot = await getDocs(refMatches)

            if (querySnapshot.docs.length > 0) {
                await querySnapshot.docs.map(doc => deleteDoc(doc.ref))
            } else {
                const item = Object.assign(product, {id})
                await setDoc(refDoc, item)
            }

        } catch (e) {console.error('Error adding document: ', e)}
    }

    const handlerClickSize = (e) => {
        const list = sizeButton.current.childNodes
        list.forEach(btn => btn.classList.remove('active'))
        e.target.classList.add('active')
    }

    return (
        <div className={styles.cardInfoWrapper}>
            <div className={styles.infoBreadCrumbs}>
                <Link to={'/'}>
                    <img src="/image/favorites-back.svg" alt="Back-up"/>
                </Link>
                <span>{product.title}</span>
            </div>
            <div className={styles.infoInnerBlock}>
                <CardGallery
                    product={product}
                    setImageActive={setImageActive}
                    imageActive={imageActive}
                />
                <CardContents
                    product={product}
                    addCardFromFavorites={addCardFromFavorites}
                    addCardFromBasket={addCardFromBasket}
                    addedFavorites={favorites.some(obj => obj.id === id)}
                    addedBasket={basket.some(obj => obj.id === id)}
                    handlerClickSize={handlerClickSize}
                    sizeButton={sizeButton}
                />
            </div>
            <div className={styles.infoDescription}>
                <h3>Описание товара</h3>
                <p>{product.description}</p>
            </div>
            <div className={styles.infoDetails}>
                <div className={styles.infoDetailsParent}>
                    <div className={styles.infoDetailsTitle1}>Бренд</div>
                    <div className={styles.infoDetailsDeskrip1}>
                        <p>{product.branded}</p>
                    </div>
                    <div className={styles.infoDetailsTitle2}>Продавец</div>
                    <div className={styles.infoDetailsDeskrip2}>
                        <p>{product.salesman}</p>
                    </div>
                    <div className={styles.infoDetailsTitle3}>Страна производства</div>
                    <div className={styles.infoDetailsDeskrip3}>
                        <p>{product.country}</p>
                    </div>
                    <div className={styles.infoDetailsTitle4}>Состав</div>
                    <div className={styles.infoDetailsDeskrip4}>
                        <p>{product.material}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardInfo