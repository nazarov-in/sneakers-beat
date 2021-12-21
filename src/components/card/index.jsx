import React, {useState} from 'react'
import {useNavigate} from "react-router-dom"
import {useBreakNumber} from "../../hooks"

import styles from './Card.module.scss'

const Card = (props) => {
    const {title, image, price, addCartItem, addedBasket,
        addedFavorites = false, addCardFromFavorites, good} = props

    const navigate = useNavigate()
    const [inBasket, setInBasket] = useState(addedBasket)
    const [inFavorites, setInFavorites] = useState(addedFavorites)
    const {cost} = useBreakNumber(price)

    const clickToCard = (e) => {
        if(e.target.className !== 'cardNoClick' && addCardFromFavorites) {
            navigate(`/${good.id}`)
        }
    }

    return (
        <div onClick={clickToCard} className={styles.cardWrapper}>
            <div className={styles.cardFavorite}>
                {addCardFromFavorites && (
                    <img
                        className="cardNoClick"
                        src={`/image/${!inFavorites ? 'heart-unliked.png':'heart-liked.svg'}`}
                        onClick={() => {addCardFromFavorites(); setInFavorites(!inFavorites) }}
                        alt="unliked"
                    />
                )}
            </div>
            <img src={image} alt={title}/>
            <h5>{title}</h5>
            <div className="d-flex space-between align-center">
                <div className={`${styles.cardPrice} d-flex`}>
                    <p>Цена:</p>
                    <span>{cost} руб.</span>
                </div>
                {addCardFromFavorites && (
                    <img
                        className="cardNoClick"
                        onClick={() => {setInBasket(!inBasket); addCartItem()}}
                        src={`/image/${addedBasket ? 'button-un-click.png' : 'button-click.png'}`}
                        alt="cart"
                    />
                )}
            </div>
        </div>
    )
}

export default Card