import React from 'react'
import styles from './Search.module.scss'

const Search = ({setSearchValue, searchValue}) => {

    return (
        <div className={`${styles.searchWrapper} d-flex align-center`}>
            <img src="/image/search.svg" alt="search"/>
            <input
                type="text"
                placeholder="Поиск..."
                defaultValue={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
        </div>
    )
}

export default Search