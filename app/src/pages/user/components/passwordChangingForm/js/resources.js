import React from "react"
import * as Yup from "yup"
import {Form} from "formik"
import FieldsDividerWrapper from "../../../../../components/formContainers/fieldsDividerWrapper"
import TextInput from "../../../../../components/formElements/textInput"
import Button from "../../../../../components/formElements/button"
import Notification from "../../../../../components/various/notification"
import Error from "../../../../../components/formElements/error"


// Начальные значения полей формы
export const initialValues = {
    "passwordCurrent": '',
    "password": '',
    "passwordConfirm": ''
}

// Проверка полей формы
export const validationSchema = Yup.object({
    passwordCurrent: Yup.string()
        .required('This field is required')
        .min(4, 'Must be 4 characters or more'),
    password: Yup.string()
        .required('This field is required')
        .min(4, 'Must be 4 characters or more'),
    passwordConfirm: Yup.string().oneOf(
        [Yup.ref("password")],
        "Both passwords need to be the same"
    )
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
                <TextInput label='Current password' type='password' name='passwordCurrent' disabled={isDisabled} autoComplete="current-password" />
            </FieldsDividerWrapper>
            <FieldsDividerWrapper indent='2'>
                <TextInput label='New password' type='password' name='password' disabled={isDisabled} autoComplete="new-password" />
            </FieldsDividerWrapper>
            <FieldsDividerWrapper indent='2'>
                <TextInput label='New password' type='password' name='passwordConfirm' disabled={isDisabled} autoComplete="new-password" />
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
    // По какому адресу буду делать запрос на изменение пароля
    const apiUrl = '/api/v1/users/myPassword'
    
    // Параметры запроса
    const options = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
    }
    
    // Сделаю запрос на сервер и полученные данные помещу в serverRes
    const serverRes = await fetch(apiUrl, options)
        .then(res => res.json())
        .then(res => res)
        .catch(err => console.log(err))
    
    
    
    /* Если всё верно, то в serverRes будет объект с успехом:
    {
        "status": "success",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMDk3MTc4MTE3YzhmNDVmNzRiMjc3OSIsImlhdCI6MTU5NDY0MjE0NiwiZXhwIjoxNjAyNDE4MTQ2fQ.vLPLRc4cXT9L2SjEHGFrAYV4fqzYanQFFrgP701aL1M",
        "data": {
            "user": {
                "name": "Andrew Kozinsky",
                "email": "andkozinskiy@yandex.ru"
            }
        }
    }*/
    if(serverRes.status === 'success') {
        
        // Уведомить пользователя об успешном изменении пароля
        setNotification(
            <Notification topIndent='1'>The password has been changed.</Notification>
        )
    }
    else {
        /*
        Если в serverRes будет ошибка, то показать ошибку:
        {
            "status": "fail",
            "error": {
                "statusCode": 401,
                "isOperational": true,
                "message": "User recently changed password! Please log in again."
            }
        }*/
        /*{
            "status": "fail",
            "error": {
                "statusCode": 401,
                "isOperational": true,
                "message": "Your current password is wrong"
            }
        }*/
        /*{
            "status": "error",
            "error": {
                "statusCode": 400,
                "message": "Invalid input data: Please provide a password. A password must have at least 4 characters.. Passwords are not equal!"
            }
        }*/
        setServerErr(
            <Error text={serverRes.error.message} indent='3' />
        )
    }
}
