import React from "react"
import * as Yup from "yup"
import {Form} from "formik"
import FieldsDividerWrapper from "../../../../../components/formContainers/fieldsDividerWrapper"
import TextInput from "../../../../../components/formElements/textInput"
import Button from "../../../../../components/formElements/button"
import {setUser} from "../../../../../store/actions"
import Error from "../../../../../components/formElements/error"


// Начальные значения полей формы
export const initialValues = {
    password: '',
    passwordConfirm: ''
}

// Проверка полей формы
export const validationSchema = Yup.object({
    password: Yup.string()
        .required('This field is required')
        .min(4, 'Must be 4 characters or more'),
    passwordConfirm: Yup.string()
        .oneOf(
            [Yup.ref('password')],
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
                <TextInput label='Password' type='password' name='password' disabled={isDisabled} autoComplete="new-password" />
            </FieldsDividerWrapper>
            
            <FieldsDividerWrapper indent='2'>
                <TextInput label='Confirm password' type='password' name='passwordConfirm' disabled={isDisabled} autoComplete="new-password" />
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
 * @param {String} token — токен сброса пароля
 * @param {Function} dispatch — диспатчер экшен-функции.
 * @param {Function} setGoToNotes — если в функцию передать true, то браузер перейдёт на страницу с заметками
 */
export async function onSubmitHandler(values, setServerErr, token, dispatch, setGoToNotes) {
    
    // По какому адресу буду делать запрос на вход пользователя
    const apiUrl = '/api/v1/users/resetPassword/' + token
    
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
    
    /*
    Если в serverRes будет объект с ошибкой про испорченный токен...
    {
        "status": "fail",
        "error": {
            "statusCode": 400,
            "isOperational": true,
            "message": "Token is invalid or has expired"
        }
    }
    Или про неверные пароли...
    {
        "status": "error",
        "error": {
            "statusCode": 400,
            "message": "Invalid input data: Passwords are not equal!"
        }
    }
    то показать сообщение об ошибке:
    */
    if(serverRes.status === 'fail') {
        setServerErr(
            <Error text={serverRes.error.message} indent='3' />
        )
    }
    
    if(serverRes.status === 'success') {
    
        // Получить данные пользователя
        const {name, email} = serverRes.data.user
        
        // Поставить их в Хранилище
        dispatch(setUser(name, email))
    
        // Перейти на страницу заметок
        setTimeout(function () {
            setGoToNotes(true)
        }, 0)
    }
}
