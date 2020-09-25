import React from 'react'
import {useDispatch, useSelector} from "react-redux"
import {Switch, Route, Redirect} from 'react-router-dom'
import {checkToken} from '../../utils/checkToken'
import NotesPage from "../../pages/notes"
import UserPage from "../../pages/user"
import {setAuthTokenStatus} from "../../store/actions"
import {setUserDataToStore} from "./js/resources"
import Spinner from "../../components/various/spinner"
import TopNav from "./components/topNav"

function UserAreaPages() {
    const dispatch = useDispatch()
    
    // Получу имя пользователя и статус токена авторизации
    const {name, authTokenStatus} = useSelector(state => state.user)
    
    // Если authTokenStatus равен нулю, то не понятно есть ли в браузере токен и верен ли он. Поэтому проверю.
    if(authTokenStatus === 0) {
        // Получить статус токена авторизации (1 или 2)
        checkToken().then((tokenStatus) => {
            // Поставить новый статус токена авторизации
            dispatch( setAuthTokenStatus(tokenStatus) )
        })
    }
    
    if(authTokenStatus === 1) return <Redirect to='/enter'/>
    
    // Если нет имени, то нарисовать загрузчик
    if(!name) {
        // Получить данные пользователя и поставиь в Хранилище
        setUserDataToStore(dispatch)
        
        return <Spinner text='Downloading notes' />
    }
    
    return (
        <>
            <TopNav />
            
            <Switch>
                <Route path='/notes'>
                    <NotesPage />
                </Route>
                <Route path='/user'>
                    <UserPage />
                </Route>
            </Switch>
        </>
    )
}

export default UserAreaPages