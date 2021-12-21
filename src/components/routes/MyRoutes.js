import React from 'react'
import {Routes, Route} from "react-router-dom"

import SignUp from "../sign-up"
import SignIn from "../sign-in"
import Header from "../header"
import Home from "../home"
import Overlay from "../overlay"
import Favorites from "../favorites"
import Orders from "../orders"
import CardInfo from "../card-info"

const MyRoutes = (isAuth) => {
    if (isAuth) {
        return (
            <>
                <Overlay/>
                <Header/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/:id" element={<CardInfo/>}/>
                    <Route path="/favorites" element={<Favorites/>}/>
                    <Route path="/orders" element={<Orders/>}/>
                    <Route path="*" element={<Home/>}/>
                </Routes>
            </>
        )
    }

    return (
        <>
            <Header/>
            <Routes>
                <Route path="/sign-in" element={<SignIn/>}/>
                <Route path="/sign-up" element={<SignUp/>}/>
                <Route path="*" element={<SignIn/>}/>
            </Routes>
        </>
    )
}

export default MyRoutes