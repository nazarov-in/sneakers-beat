import React, {useState} from 'react'
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth"
import {Link, useNavigate} from "react-router-dom"
import {useDispatch} from "react-redux"
import {userAuthAction} from "../../reducers/userAuthReducer"

import styles from './SignUp.module.scss'

const SignUp = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [invalidEmail, setInvalidEmail ] = useState(false)
    const [invalidPassword, setInvalidPassword ] = useState(false)
    const [invalidEmailUse, setInvalidEmailUse ] = useState(false)

    const createNewUser = async ({email, password}) => {
        setInvalidEmail(false)
        setInvalidPassword(false)
        setInvalidEmailUse(false)

        const auth = getAuth()
        await createUserWithEmailAndPassword(auth, email, password)
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
                const errorCode = error.code
                if(errorCode === "auth/invalid-email"){
                    setInvalidEmail(true)
                }
                else if(errorCode === "auth/internal-error"){
                    setInvalidPassword(true)
                }
                else if(errorCode === "auth/email-already-in-use"){
                    setInvalidEmailUse(true)
                }
            })
    }

    const getDataNewUser = (e) => {
        e.preventDefault()
        const data = e.target.elements
        const user = {
            name: data.name.value,
            userName: data.userName.value,
            email: data.email.value,
            password: data.password.value,
        }

        createNewUser(user)
   }

    return (
        <div className={styles.signUpWrapper}>
            <div className={styles.formWrapper}>
                <h1>Регистрация</h1>
                <form onSubmit={getDataNewUser} className={styles.formInner}>
                    <input type="text" name="name" placeholder="Ваше имя"/>
                    <input type="text" name="userName" placeholder="Имя пользователя"/>
                    <input type="email" name="email" placeholder="Введите e-mail"/>
                    <input type="password" name="password" placeholder="Введите пароль"/>
                    {invalidEmail && <span>Введите валидный e-mail</span>}
                    {invalidEmailUse && <span>Такой e-mail уже зарегистрирован</span>}
                    {invalidPassword && <span>Введите пароль от 6 символов</span>}
                    <p>Уже есть аккаунт? <Link to="/sign-in">Войти</Link></p>
                    <button type="submit">Зарегистрироваться</button>
                </form>
            </div>
        </div>
    )
}

export default SignUp