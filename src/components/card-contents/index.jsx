import React, {useState} from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSnowflake, faSun} from "@fortawesome/free-solid-svg-icons"
import {useBreakNumber} from "../../hooks"

import styles from "../card-info/CardInfo.module.scss"

const CardContents = (props) => {
    const {product, addCardFromFavorites, addCardFromBasket,
        addedFavorites, addedBasket, handlerClickSize, sizeButton} = props

    const [inFavorites, setInFavorites] = useState(addedFavorites)
    const [inBasket, setInBasket] = useState(addedBasket)
    const {cost} = useBreakNumber(product.price)

    return (
        <div className={styles.infoContents}>
            <h2>{product.title}</h2>
            <div className={styles.infoWrapperSex}>
                <div className={styles.infoContentsNew}>{product.sex}</div>
                <div className={styles.infoPurpose}>
                    {product.purpose}
                    <FontAwesomeIcon
                        style={product.purpose === 'Лето' ? {color: '#FFE600'} : {color: '#6695ff'}}
                        icon={product.purpose === 'Лето' ? faSun : faSnowflake}
                    />
                </div>
            </div>
            <span>{cost} руб.</span>
            <ul className={styles.infoContentsPrices} ref={sizeButton}>
                <li onClick={handlerClickSize}>39</li>
                <li onClick={handlerClickSize}>40</li>
                <li onClick={handlerClickSize}>41</li>
                <li onClick={handlerClickSize}>42</li>
                <li onClick={handlerClickSize}>43</li>
            </ul>
            <p>Обращаем внимание, российский размер (RU) не указывается на коробке. Переведен
                автоматически по стандартам ГОСТ из сантиметров (СМ)</p>
            <div className={styles.infoButton}>
                <button
                    onClick={() => {addCardFromBasket(); setInBasket(!inBasket)}}>
                    {addedBasket ? 'В корзине' : 'Добавить к заказу'}
                </button>
                <div
                    className={styles.infoButtonLike}
                    onClick={() => {addCardFromFavorites(); setInFavorites(!inFavorites)}}
                >
                    <img src={`/image/${addedFavorites ? 'card-like.svg':'card-unlike.png'}`} alt="Like"/>
                </div>
            </div>
        </div>
    )
}

export default CardContents