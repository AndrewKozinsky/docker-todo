import React, {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {Redirect, useParams} from "react-router-dom"
import {setAuthTokenStatus, setUser} from '../../store/actions'
import logo from './svg/logo.svg'
import s from './css/messagePage.scss'


function MessagePage() {
    
    // Получу тип сообщения из адресной строки
    const type = new URLSearchParams(window.location.search).get('type')
    
    let messageElem = null
    
    switch (type) {
        case 'emailIsNotConfirmed':
            messageElem = <EmailIsNotConfirmed />
            break
        case 'emailIsConfirmed':
            messageElem = <EmailIsConfirmed />
            break
    }
    
    return (
        <div className={s.pageWrapper}>
            <img src={logo} className={s.logo} alt='Todo service logotype' />
            {messageElem}
        </div>
    )
}

function EmailIsNotConfirmed() {
    return <p className={s.text}>Your email has not been confirmed. Maybe you have already confirmed your email or you got the wrong address.</p>
}

function EmailIsConfirmed() {
    const dispatch = useDispatch()
    
    // В переменной хранится булево значение нужно ли делать переадресацию на другую страницу
    const [redirectToNewPage, setRedirectToNewPage] = useState(false)
    
    // Через 5 секунд после открытия страницы перебросить на другую страницу
    useEffect(function () {
        // Поставить данные пользователя в Хранилище
        setUserDataToStore(dispatch)
        
        setTimeout(function () {
            setRedirectToNewPage(true)
        }, 5000)
    }, [])
    
    // Если в true, то перебросить пользователя на другую страницу
    if(redirectToNewPage) return <Redirect to='notes' />
    
    return <p className={s.text}>Your email has been confirmed! You will be redirected to Notes page in 5 seconds...</p>
}

// Фукнция делает запрос на проверку токена чтобы получить данные о пользователе.
async function setUserDataToStore(dispatch) {
    
    // Параметры запроса
    const options = {
        method: 'POST'
    }
    const apiUrl = '/api/v1/users/getTokenInfo'
    
    try {
        const tokenInfo = await fetch(apiUrl, options)
            .then(data => data.json())
            .then(json => json)
    
        if(tokenInfo.status === 'success') {
            // Поставить данные о пользователе в Хранилище
            dispatch(setUser(tokenInfo.data.name, tokenInfo.data.email))
            // Поставить в Хранилище что токен авторизации хранится в браузере
            dispatch(setAuthTokenStatus(2))
        }
    }
    catch (err) {
        console.log(`Could't get information about authorization token.`)
    }
}

export default MessagePage