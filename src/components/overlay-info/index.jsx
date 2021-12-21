import React from 'react'
import styles from "../overlay/Overlay.module.scss"

const OverlayInfo = ({image, title, description, closeBasket, basketEmpty = false}) => {
    return (
        <>
            <img src={image} alt="empty-cart"/>
            <h3 style={basketEmpty ? {color: '#87C20A'} : null}>{title}</h3>
            <p>{description}</p>
            <button className={styles.btnGreen} onClick={closeBasket}>
                <img src="/image/arrow.svg" alt="arrow"/>
                Вернуться назад
            </button>
        </>
    )
}

export default OverlayInfo