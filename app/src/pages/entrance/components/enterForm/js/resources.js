import React from "react";
import * as Yup from "yup";
import {Form} from "formik";
import FieldsDividerWrapper from "../../../../../components/formContainers/fieldsDividerWrapper";
import TextInput from "../../../../../components/formElements/textInput";
import Button from "../../../../../components/formElements/button";
import {setAuthTokenStatus, setUser} from "../../../../../store/actions";
import Notification from "../../../../../components/various/notification";
import Error from "../../../../../components/formElements/error";


// Начальные значения полей формы
export const initialValues = {
    email: '',
    password: ''
}

// Проверка полей формы
export const validationSchema = Yup.object({
    email: Yup.string()
        .required('This field is required')
        .email('Invalid email address'),
    password: Yup.string()
        .required('This field is required')
        .min(4, 'Must be 4 characters or more')
})


/**
 * Функция возвращает отрисовываемую форму
 * @param {Object} formik — объект с со свойствами и методами возаращаемыми библиотекой Formik
 * @param {Function} setServerErr — функция показывающая и скрывающая текст ошибки от сервера.
 * В этой функции она постоянно будет запускаться в значении null
 * чтобы после любого изменения формы текст ошибки сервера бы скрывался.
 * @returns {*}
 */
export function createForm(formik, setServerErr) {
    
    // Если форму отправили, то заблокировать поля ввода
    let isDisabled = formik.isSubmitting
    
    return (
        <Form onChange={() => setServerErr(null)}>
            <FieldsDividerWrapper indent='2'>
                <TextInput label='Email' type='email' name='email' disabled={isDisabled} autoComplete="email" />
            </FieldsDividerWrapper>
            
            <FieldsDividerWrapper indent='2'>
                <TextInput label='Password' type='password' name='password' disabled={isDisabled} autoComplete="current-password" />
            </FieldsDividerWrapper>
            
            <SubmitBtn formik={formik} />
        </Form>
    )
}

/**
 * Функция возвращает кнопку отправки формы
 * @param {Object} formik — объект с со свойствами и методами возаращаемыми библиотекой Formik
 * @returns {*}
 */
function SubmitBtn({formik}) {
    
    // Атрибуты кнопки
    const attrs = {
        text: 'Submit',
        type: 'submit'
    }
    
    // Если в форме есть ошибки или
    // форму еще не заполняли или
    // форму уже отправили,
    // то блокировать кнопку отправки
    if(!formik.isValid || !formik.dirty || formik.isSubmitting) {
        attrs.disabled = true
    }
    
    // Если форму отправили, то показать крутилку
    // чтобы уведомить пользователя об ожидании ответа сервера
    if(formik.isSubmitting) {
        attrs.sign = 'spinner'
    }
    
    return <Button {...attrs} />
}

/**
 * Обработчик отправки формы
 * @param {Object} values — объект с введёнными значениями в поля формы.
 * @param {Function} setServerErr — функция куда нужно передать текст ошибки отданной сервером.
 * @param {Function} setNotification — функция отрисовывающая уведомление.
 * @param {Function} dispatch — диспатчер экшен-функции.
 */
export async function onSubmitHandler(values, setServerErr, setNotification, dispatch) {
    
    try {
        // По какому адресу буду делать запрос на вход пользователя
        const apiUrl = '/api/v1/users/login'
    
        // Параметры запроса
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        }
        
        // Сделаю запрос на сервер и полученные данные помещу в serverRes
        const serverRes = await fetch(apiUrl, options)
            .then(res => res.json())
            .then(res => res)
            .catch(err => new Error('Something went wrong'))
        
        if(serverRes.status === 'success') {
            // Получить данные пользователя
            const userData = serverRes.data.user
            
            // Поставить их в Хранилище
            dispatch(setUser(userData.name, userData.email))
            dispatch(setAuthTokenStatus(2))
        }
        else if(serverRes.status === 'fail' && serverRes.error.statusCode === 403) {
            const mailService = 'https://' + values.email.split('@')[1]
            setNotification(
                <Notification>A letter with a link has been sent to your <a href={mailService}>email</a>. Click on it to log in your account.</Notification>
            )
            setServerErr(null)
        }
        else {
            setNotification(null)
            setServerErr(<Error text={serverRes.error.message} indent='3' />)
        }
    }
    catch (err) {
        setNotification(null)
        setServerErr(
            <Error text='Something went wrong' indent='3' />
        )
    }
}