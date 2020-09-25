import React, {useState, useEffect} from 'react';
import logo from './svg/logo.svg'
import s from './css/messagePage.scss'
import {Redirect, useParams} from "react-router-dom";
import {useDispatch} from 'react-redux'
import {setAuthTokenStatus, setUser} from '../../store/actions'


function MessagePage() {
    
    const dispatch = useDispatch()
    
    // В переменной хранится булево значение нужно ли делать переадресацию на другую страницу
    const [redirectToNewPage, setRedirectToNewPage] = useState(false)
    
    // Через 5 секунд после открытия страницы поставить в redirectToNewPage true чтобы он перебросил на другую страницу
    useEffect(function () {
        setTimeout(function () {
            setRedirectToNewPage(true)
        }, 5000)
    }, [])
    
    // Получу тип сообщения из адресной строки
    const type = new URLSearchParams(window.location.search).get('type')
    
    
    // Получу текст сообщения и адрес страницы на которую будет переадресация через 5 секунд
    let [messageText, newPageUrl] = getPageData(type)
    
    // Если тип равен emailIsConfirmed, то выполню дополнительные действия
    if(type === 'emailIsConfirmed') setUserDataToStore(dispatch)
    
    if(redirectToNewPage) return <Redirect to={newPageUrl} />
    
    if(!messageText) return <Redirect to='/enter' />
    
    return (
        <div className={s.pageWrapper}>
            <img src={logo} className={s.logo} alt='Todo service logotype' />
            <p className={s.text}>{messageText}</p>
        </div>
    )
}

function getPageData(type) {
    let messageText, newPageUrl
    
    switch (type) {
        case 'emailIsNotConfirmed':
            messageText = 'Your email has not been confirmed. Maybe you have already confirmed your email or you got the wrong address. You will be redirected to Main page in 5 seconds...'
            newPageUrl = '/'
            break;
        case 'emailIsConfirmed':
            messageText = 'Your email has been confirmed! You will be redirected to Notes page in 5 seconds...'
            newPageUrl = '/notes'
            break;
    }
    
    return [messageText, newPageUrl]
}


async function setUserDataToStore(dispatch) {
    
    // Параметры запроса
    const options = { method: 'POST' }
    const apiUrl = '/api/v1/users/getTokenInfo'
    
    const tokenInfo = await fetch(apiUrl, options)
        .then(data => data.json())
        .then(json => json)
    
    if(tokenInfo.status === 'error') return
    
    dispatch(setUser(tokenInfo.data.name, tokenInfo.data.email))
    dispatch(setAuthTokenStatus(2))
}

export default MessagePage