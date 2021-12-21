import React from 'react'
import {getAuth, signInWithEmailAndPassword} from "firebase/auth"
import {Link, useNavigate} from "react-router-dom"
import {userAuthAction} from "../../reducers/userAuthReducer"
import {useDispatch} from "react-redux"

import styles from "../sign-up/SignUp.module.scss"

const SignIn = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const createNewUser = ({email, password}) => {

        const auth = getAuth()
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user

                const userData = {
                    email: user.email,
                    id: user.uid,
                    token: user.accessToken,
                }

                dispatch(userAuthAction(userData))
                navigate("/")

            }).catch((error) => {
                console.log(error.code)
                const errorCode = error.code
                if(errorCode === "auth/invalid-email"){

                }
                else if(errorCode === "auth/internal-error"){

                }
                else if(errorCode === "auth/email-already-in-use"){

                }
            })
    }

    const getDataNewUser = (e) => {
        e.preventDefault()
        const data = e.target.elements
        const user = {
            email: data.email.value,
            password: data.password.value,
        }

        createNewUser(user)
    }

    return(
        <div className={styles.signUpWrapper}>
            <div className={styles.formWrapper}>
                <h1>Войдите</h1>
                <form onSubmit={getDataNewUser} className={styles.formInner}>
                    <input type="email" name="email" placeholder="Введите e-mail"/>
                    <input type="password" name="password" placeholder="Введите пароль"/>
                    <p>Нет аккаунта? <Link to="/sign-up">Зарегистрироваться</Link></p>
                    <button type="submit">Войти</button>
                </form>
            </div>
        </div>
    )
}

export default SignIn