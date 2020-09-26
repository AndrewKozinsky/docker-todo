import React, {useState} from 'react'
import { useDispatch } from "react-redux"
import { Formik } from 'formik'
import { Link } from 'react-router-dom'
import Header from '../../../../components/header'
import {
    initialValues,
    validationSchema,
    createForm,
    onSubmitHandler
} from "./js/resources"
import s from './css/form.scss'


// Форма регистрации нового пользователя
function RegForm() {
    
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
            <Header text='Sign up' />
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => onSubmitHandler(values, setServerErr, setNotification, dispatch)}
            >
                { formik => createForm(formik, setServerErr) }
            </Formik>
            
            {serverErr}
    
            <div className={s.bottomPart}>
                <p>Do you have an account? <Link to='/enter'>Sign in.</Link></p>
            </div>
        </div>
    )
}


export default RegForm