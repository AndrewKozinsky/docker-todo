import React from "react"
import {setAuthTokenStatus} from "../../../../../store/actions"
import Error from "../../../../../components/formElements/error"
import Notification from "../../../../../components/various/notification"


export async function deleteAccount(setServerErr, setNotification, dispatch) {
    // Спросить пользователя действительно ли он хочет удалить свою учётную запись
    const confirmAnswer = confirm('Do you really want to delete your account?')
    if(!confirmAnswer) return
    
    try {
        // По какому адресу буду делать запрос на вход пользователя
        const apiUrl = '/api/v1/users/me'
    
        // Параметры запроса
        const options = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        }
        
        // Сделаю запрос на сервер и полученные данные помещу в serverRes
        const serverRes = await fetch(apiUrl, options)
            .then(res => {
                return (res.ok)
                    ? { status: 'success' }
                    : res.json()
            })
            .then(res => res)
            .catch(err => new Error('Something went wrong'))
    
        if(serverRes.status === 'success') {
            setNotification(
                <Notification topIndent='1'>Your account has been deleted.</Notification>
            )
            setServerErr(null)
        
            // Поставить статус токена авторизации в 1 чтобы выкинуть пользователя.
            setTimeout(() => {
                dispatch(setAuthTokenStatus(1))
            }, 3000)
        }
        else {
            setNotification(null)
            setServerErr(
                <Error text={serverRes.error.message} indent='3' />
            )
        }
    }
    catch (err) {
        setNotification(null)
        setServerErr( <Error text='Something went wrong' indent='3' /> )
    }
}