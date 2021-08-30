import React from 'react'
import {useDispatch, useSelector} from "react-redux"
import {Redirect} from 'react-router-dom'
import {checkToken} from '../../utils/checkToken'
import {setAuthTokenStatus} from "../../store/actions"


function MainPage() {
    const dispatch = useDispatch()
    
    // Получу статус токена
    const { authTokenStatus } = useSelector(store => store.user)
    
    // Если authTokenStatus равен нулю, то не понятно есть ли в браузере токен и верен ли он. Поэтому проверю.
    if(authTokenStatus === 0) {
        checkToken().then((status) => {
            dispatch( setAuthTokenStatus(status) )
        })
        
        return null
    }
    
    // Если токена нет или он неверный, то пользователь еще не вошёл, перенаправить на страницу входа
    if(authTokenStatus === 1) return <Redirect to='/enter' />
    
    // Есть правильный токен. Перенаправить на страницу заметок.
    return <Redirect to='/notes' />
}

export default MainPage