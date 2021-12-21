import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getAuth, onAuthStateChanged} from "firebase/auth"
import {userAuthAction} from "../../reducers/userAuthReducer"

import MyRoutes from "../routes/MyRoutes"
import styles from './App.module.scss'

const App = () => {
    const isAuth = useSelector(state => state.userAuth.userAuth)
    const routes = MyRoutes(!!isAuth.token)
    const dispatch = useDispatch()

    useEffect(() => {
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userData = {
                    email: user.email,
                    id: user.uid,
                    token: user.accessToken,
                }
                dispatch(userAuthAction(userData))
            }
        })
    }, [dispatch])

  return (
    <div className={styles.appBackground}>
        <div className={"container"}>
            {routes}
        </div>
    </div>
  )
}

export default App