import React, { useState } from 'react'
import { useDispatch } from "react-redux"
import { Formik } from "formik"
import { Link } from "react-router-dom"
import Header from "../../../../components/header"
import {
    initialValues,
    validationSchema,
    createForm,
    onSubmitHandler
} from "./js/resources"
import s from './css/form.scss'


// Форма регистрации нового пользователя
function EnterForm() {
    
    const dispatch = useDispatch()
    
    // Сообщение об ошибке с сервера
    let [serverErr, setServerErr] = useState(null)
    
    // Уведомление
    const [notification, setNotification] = useState(null)
    
    // Если есть уведомление, то отрисовать уведомленин.
    if(notification) return notification
    
    
    // Отрисовываемая форма
    return (
        <div>
            <Header text='Log in' />
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => onSubmitHandler(values, setServerErr, setNotification, dispatch)}
            >
                { formik => createForm(formik, setServerErr) }
            </Formik>
            
            {serverErr}
    
            <div className={s.bottomPart}>
                <p>Are you a new user? <Link to='/reg'>Sign up.</Link></p>
                <p>Don't remember password? <Link to='/forgot-password'>Reset password.</Link></p>
            </div>
        </div>
    )
}


export default EnterForm