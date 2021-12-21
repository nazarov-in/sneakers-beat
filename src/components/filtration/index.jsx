import React, {useEffect} from 'react'
import {db} from "../../firebase"
import {useDispatch, useSelector} from "react-redux"
import {allGoodsAction, filterBrandedAction} from "../../reducers/goodsReducer"
import {collection, getDocs, query, where} from "firebase/firestore"
import Select from 'react-select'

import styles from './Filtration.module.scss'

const Filtration = ({selectButton, selectSex}) => {
    const dispatch = useDispatch()
    const selectBranded = useSelector(state => state.allGoods.branded)

    useEffect(() => {
        const list = selectButton.current.childNodes
        list[0].classList.add('active')
    }, [])

    const options = [
        { value: 'any', label: 'Любой' },
        { value: 'Мужские', label: 'Мужской' },
        { value: 'Женские', label: 'Женский' }
    ]

    const customStyles = {
        menu: (provided) => ({
            ...provided, width: '120px'
        }),

        control: (_) => ({display: 'flex'}),

        singleValue: (provided, state) => {
            const opacity = state.isDisabled ? 0.5 : 1
            const transition = 'opacity 300ms'

            return { ...provided, opacity, transition }
        }
    }

    const getDataForSex = async (e) => {
        const list = selectButton.current.childNodes
        list.forEach(btn => btn.className  === 'active' && dispatch(filterBrandedAction(btn.name)))
        const data = []
        let refMatches = []

        try {
            const colRef = collection(db, `all-sneakers`)

            if (e.value === 'any') {
                if (selectBranded === 'All') refMatches = query(colRef)
                else refMatches = query(colRef, where('branded', "==", selectBranded))
            } else {
                if (selectBranded === 'All') refMatches = query(colRef, where('sex', "==", e.value))
                else refMatches = query(colRef, where('branded', "==", selectBranded), where('sex', "==", e.value))
            }

            const querySnapshot = await getDocs(refMatches)
            await querySnapshot.docs.map(doc => {
                data.push(Object.assign(doc.data(), {id: doc.id}))
            })

            dispatch(allGoodsAction(data))
        } catch (e) {console.error('Error adding document: ', e)}
    }

    const getDataForFilter = async (e) => {
        // remove all active classes and add a new one
        const list = selectButton.current.childNodes
        list.forEach(btn => btn.classList.remove('active'))
        e.target.classList.add('active')

        const sex = selectSex.current.props.value.value
        const name = e.target.name
        let refMatches = []
        const data = []

        try {
            const colRef = collection(db, `all-sneakers`)
            if (name === 'All' ) {
                await dispatch(filterBrandedAction(name))
                if (sex === 'any') refMatches = query(colRef)
                else refMatches = query(colRef,  where('sex', "==", sex))
            } else {
                await dispatch(filterBrandedAction(name))
                if (sex === 'any') refMatches = query(colRef, where('branded', "==", name))
                else refMatches = query(colRef, where('branded', "==", name), where('sex', "==", sex))
            }

            const querySnapshot = await getDocs(refMatches)
            await querySnapshot.docs.map(doc => {
                data.push(Object.assign(doc.data(), {id: doc.id}))
            })

            dispatch(allGoodsAction(data))
        } catch (e) {console.error('Error adding document: ', e)}
    }

    return (
        <div className={styles.filtrationWrapper}>
            <div className={styles.filtrationSelect}>
                <p>Пол:</p>
                <Select
                    ref={selectSex}
                    onChange={getDataForSex}
                    options={options}
                    styles={customStyles}
                    defaultValue={options[0]}
                />
            </div>
            <div className={styles.filtrationButtons} ref={selectButton}>
                <button onClick={getDataForFilter} name="All">Все кроссовки</button>
                <button onClick={getDataForFilter} name="Adidas">Adidas</button>
                <button onClick={getDataForFilter} name="Nike">Nike</button>
                <button onClick={getDataForFilter} name="Jordan">Jordan</button>
                <button onClick={getDataForFilter} name="Puma">Puma</button>
                <button onClick={getDataForFilter} name="Reebok">Reebok</button>
            </div>
        </div>
    )
}

export default Filtration