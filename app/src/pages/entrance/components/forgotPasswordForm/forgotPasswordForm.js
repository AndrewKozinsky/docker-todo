import React, {useState} from 'react'
import {useDispatch} from "react-redux"
import { Formik} from "formik"
import Header from "../../../../components/header"
import {
    initialValues,
    validationSchema,
    createForm,
    onSubmitHandler
} from "./js/resources"


// Форма регистрации нового пользователя
function ForgotPasswordForm() {
    
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
            <Header text='Reset Password' />
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => onSubmitHandler(values, setServerErr, setNotification, dispatch)}
            >
                { formik => createForm(formik, setServerErr) }
            </Formik>
    
            {serverErr}
        </div>
    )
}


export default ForgotPasswordForm