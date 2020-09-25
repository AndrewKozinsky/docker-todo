import React from "react"
import axios from "axios"
import {setAuthTokenStatus} from "../../../../../store/actions"
import Error from "../../../../../components/formElements/error"
import Notification from "../../../../../components/various/notification"


export async function deleteAccount(setServerErr, setNotification, dispatch) {
    // Спросить пользователя действительно ли он хочет удалить свою учётну запись
    const confirmAnswer = confirm('Do you really want to delete your account?')
    if(!confirmAnswer) return
    
    // По какому адресу буду делать запрос на вход пользователя
    const apiUrl = '/api/v1/users/me'
    
    let serverRes = await axios({
        method: 'delete',
        withCredentials: true,
        url: apiUrl
    })
    serverRes = serverRes.data
    
    /* В случае удачного удаления должен прийти такой объект
    {
        status: 'success',
        data: null
    }
    Но по факту приходит null. Наверно потому что 204 статус ответа
    */
    if(serverRes.status === 'success' || !serverRes) {
        setNotification(
            <Notification topIndent='1'>Deleting your account...</Notification>
        )
    
        window.addEventListener('unload', () => kickUser(dispatch))
        
        setTimeout(() => {
            // Поставить статус токена авторизации в 1 чтобы выкинуть пользователя.
            dispatch(setAuthTokenStatus(1))
        }, 5000)
    }
    else {
        /* Если придёт ошибочный ответ, то показать ошибку.
        {
            "status": "fail",
            "error": {
            "statusCode": 401,
                "isOperational": true,
                "message": "User recently changed password! Please log in again."
            }
        }*/
        setServerErr(
            <Error text={serverRes.error.message} indent='3' />
        )
    }
}