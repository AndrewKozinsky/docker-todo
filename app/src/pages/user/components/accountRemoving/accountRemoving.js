import React, {useState} from 'react'
import {useDispatch} from "react-redux"
import Button from "../../../../components/formElements/button";
import {deleteAccount} from './js/resources'



const AccountRemoving = () => {
    const dispatch = useDispatch()
    
    // Сообщение об ошибке с сервера
    let [serverErr, setServerErr] = useState(null)
    
    // Уведомление
    const [notification, setNotification] = useState(null)
    
    return <>
        <Button text='Delete the account' onClick={() => deleteAccount(setServerErr, setNotification, dispatch)} />
        {serverErr}
        {notification}
    </>
}

export default AccountRemoving;