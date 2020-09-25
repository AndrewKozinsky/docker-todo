import React from "react"
import * as Yup from "yup"
import {Form} from "formik"
import axios from "axios"
import FieldsDividerWrapper from "../../../../../components/formContainers/fieldsDividerWrapper"
import TextInput from "../../../../../components/formElements/textInput"
import Button from "../../../../../components/formElements/button"
import {setAuthTokenStatus} from "../../../../../store/actions"
import Notification from "../../../../../components/various/notification"
import Error from "../../../../../components/formElements/error"




// Проверка полей формы
export const validationSchema = Yup.object({
    email: Yup.string()
        .required('This field is required')
        .email('Invalid email address')
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
    
    // По какому адресу буду делать запрос на вход пользователя
    const apiUrl = '/api/v1/users/myEmail'
    
    let serverRes = await axios({
        method: 'put',
        url: apiUrl,
        withCredentials: true,
        data: values
    })
    serverRes = serverRes.data
    
    
    /*
    Если в serverRes будет ошибка, то пользователю удалось отправить форму без почты
    или он ввёл существующую почту: показать ошибку:
    {
        "status": "fail",
        "error": {
            "statusCode": 400,
            "isOperational": true,
            "message": "Cannot change email because it didn't pass."
        }
    }*/
    if(serverRes.status === 'fail' && serverRes.error.statusCode === 400) {
        setServerErr(
            <Error text={serverRes.error.message} indent='3' />
        )
    }
    
    /* Если всё верно, то в serverRes будет объект с успехом:
    {
        "status": "success",
        "data": {
            "user": {
                "name": "Андрей Козинский",
                "email": "andkozinskiy2@yandex.ru"
            }
        }
    }*/
    if(serverRes.status === 'success') {
    
        const mailService = 'https://' + values.email.split('@')[1]
        
        // Уведомить пользователя о необходимости подтвердить почту
        setNotification(
            <Notification topIndent='1'>The confirmation letter was sent to <a href={mailService}>your new email</a>. Click link on it to confirm your new email address.</Notification>
        )
        
        window.addEventListener('unload', () => kickUser(dispatch))
        
        setTimeout(() => {
            kickUser(dispatch)
        }, 10000)
    }
}

function kickUser(dispatch) {
    
    // Поставить статус токена авторизации в 1 чтобы выкинуть пользователя.
    dispatch(setAuthTokenStatus(1))
}
