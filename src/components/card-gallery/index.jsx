import React from 'react'
import styles from "../card-info/CardInfo.module.scss"

const CardGallery = ({product, setImageActive, imageActive}) => {
    return (
        <div className={styles.infoGallery}>
            <div className={styles.infoGalleryMin}>
                <div className={styles.infoGalleryBox}
                     style={product.image ? {
                         background: `url(${product.image}) no-repeat 55% 0% / 73%`,
                     } : null}
                     onClick={() => setImageActive(product.image)}
                >
                </div>
                <div className={styles.infoGalleryBox}
                     style={product.imageBackView ? {
                         background: `url(${product.imageBackView}) no-repeat 55% 0% / 73%`,
                     } : null}
                     onClick={() => setImageActive(product.imageBackView)}
                >
                </div>
                <div className={styles.infoGalleryBox}
                     style={product.imageSideView ? {
                         background: `url(${product.imageSideView}) no-repeat 55% 0% / 73%`,
                     } : null}
                     onClick={() => setImageActive(product.imageSideView)}
                >
                </div>
                <div className={styles.infoGalleryBox}
                     style={product.imageFrontView ? {
                         background: `url(${product.imageFrontView}) no-repeat 55% 0% / 73%`,
                     } : null}
                     onClick={() => setImageActive(product.imageFrontView)}
                >
                </div>
            </div>
            <div
                className={styles.infoGalleryBig}
                style={imageActive && product.image ? {
                    background: `url(${imageActive}) no-repeat 73% 70% / 95%`,
                }:null}
            >
            </div>
        </div>
    )
}

export default CardGallery