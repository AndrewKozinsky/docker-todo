import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux"
import {Formik} from "formik"
import {
    initialValues,
    validationSchema,
    onSubmitHandler,
    createForm,
} from "./js/resources"
import s from '../../css/userPage.scss'


const PasswordChangingForm = () => {
    const dispatch = useDispatch()
    
    // Сообщение об ошибке с сервера
    let [serverErr, setServerErr] = useState(null)
    
    // Уведомление
    const [notification, setNotification] = useState(null)
    
    return (
        <div className={s.formOuter}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => onSubmitHandler(values, setServerErr, setNotification, dispatch)}
            >
                { formik => createForm(formik, setServerErr) }
            </Formik>
            {serverErr}
            {notification}
        </div>
    )
}

export default PasswordChangingForm