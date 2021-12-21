import React from 'react'

import {useBreakNumber} from "../../hooks"
import styles from "../overlay/Overlay.module.scss"

const OverlayCard = ({content, removeCardFromBasket}) => {
    const {cost} = useBreakNumber(content.price)

    return (
        <div className={`${styles.basketCartItem} d-flex align-center`} key={content.id}>
            <img className={styles.basketCartBlock} src={content.image} alt={content.title}/>
            <div>
                <h5>{content.title}</h5>
                <p>{cost} руб.</p>
            </div>
            <img
                className={styles.basketCartRemove}
                onClick={() => removeCardFromBasket(content)}
                src="/image/btn-remove.svg"
                alt="remove"
            />
        </div>
    )
}

export default OverlayCard