import React, {useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {Formik} from "formik"
import {
    createForm,
    onSubmitHandler,
    validationSchema
} from "./js/resources"
import s from '../../css/userPage.scss'


function DataForm() {
    const dispatch = useDispatch()
    
    // Сообщение об ошибке с сервера
    let [serverErr, setServerErr] = useState(null)
    
    // Уведомление
    const [notification, setNotification] = useState(null)
    
    // Получу имя пользователя чтобы поставить как значение поля формы
    const {name} = useSelector(state => state.user)
    
    // Начальные значения полей формы
    const initialValues = {name}
    
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

export default DataForm