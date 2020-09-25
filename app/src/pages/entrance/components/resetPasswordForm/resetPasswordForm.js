import React, {useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import { Formik} from "formik";
import {Redirect, useParams} from "react-router-dom"
import Header from "../../../../components/header"
import {
    initialValues,
    validationSchema,
    createForm,
    onSubmitHandler
} from "./js/resources"


// Форма регистрации нового пользователя
function ResetPasswordForm() {
    
    const dispatch = useDispatch()
    
    // Получу из адресной строки токен сброса пароля
    let { token } = useParams();
    
    // Сообщение об ошибке с сервера
    let [serverErr, setServerErr] = useState(null)
    
    // Нужно ли делать переадресацию на страницу заметок
    const [goToNotes, setGoToNotes] = useState(false)
    
    if(goToNotes) {
        return <Redirect to='/notes'/>
    }
    
    
    // Отрисовываемая форма
    return (
        <div>
            <Header text='Password Reset' />
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => onSubmitHandler(values, setServerErr, token, dispatch, setGoToNotes)}
            >
                { formik => createForm(formik, setServerErr) }
            </Formik>
            
            {serverErr}
        </div>
    )
}


export default ResetPasswordForm