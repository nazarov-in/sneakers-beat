import React from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import styles from './Sliders.module.scss'

const Sliders = ({handlerClick}) => {
    const settings = {
        arrows: true,
        autoplay: true,
        autoplaySpeed: 4000,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    }

    return (
        <Slider {...settings} className={styles.sliderArrow}>
            <div>
                <div className={styles.sliderWrapper} style={{background: `url(image/slider-one.png)`}}>
                    <div className={styles.sliderInnerAdidas}>
                        <h2><span>Stan Smith,</span> Forever!</h2>
                        <button className={styles.sliderButton} name="Adidas" onClick={handlerClick}>К коллекции</button>
                    </div>
                </div>
            </div>
            <div>
                <div className={styles.sliderWrapper} style={{background: `url(image/slider-two.png)`}}>
                    <div className={styles.sliderInnerNike}>
                        <h2><span>Nike Air </span>Jordan</h2>
                        <button className={styles.sliderButton} name="Nike" onClick={handlerClick}>К коллекции</button>
                    </div>
                </div>
            </div>
            <div>
                <div className={styles.sliderWrapper} style={{background: `url(image/slider-tree.png)`}}>
                    <div className={styles.sliderInnerPuma}>
                        <h2>Puma <br/><span> new collection</span></h2>
                        <button className={styles.sliderButton} name="Puma" onClick={handlerClick}>К коллекции</button>
                    </div>
                </div>
            </div>
        </Slider>
    )
}

export default Sliders