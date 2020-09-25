import React from "react";
import * as Yup from "yup";
import {Form} from "formik";
import FieldsDividerWrapper from "../../../../../components/formContainers/fieldsDividerWrapper";
import TextInput from "../../../../../components/formElements/textInput";
import Button from "../../../../../components/formElements/button";
import Notification from "../../../../../components/various/notification";
import Error from "../../../../../components/formElements/error";


// Начальные значения полей формы
export const initialValues = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
}

// Проверка полей формы
export const validationSchema = Yup.object({
    name: Yup.string()
        .required('This field is required')
        .min(1, 'Must be 1 characters or more'),
    email: Yup.string()
        .required('This field is required')
        .email('Invalid email address'),
    password: Yup.string()
        .required('This field is required')
        .min(4, 'Must be 4 characters or more'),
    passwordConfirm: Yup.string()
        .oneOf(
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
                <TextInput
                    label='Name'
                    type='text'
                    name='name'
                    disabled={isDisabled}
                    autoComplete="username" />
            </FieldsDividerWrapper>
            
            <FieldsDividerWrapper indent='2'>
                <TextInput
                    label='Email'
                    type='email'
                    name='email'
                    disabled={isDisabled}
                    autoComplete="email" />
            </FieldsDividerWrapper>
            
            <FieldsDividerWrapper indent='2'>
                <TextInput
                    label='Password'
                    type='password'
                    name='password'
                    disabled={isDisabled}
                    autoComplete="new-password" />
            </FieldsDividerWrapper>
            
            <FieldsDividerWrapper indent='2'>
                <TextInput
                    label='Confirm Password'
                    type='password'
                    name='passwordConfirm'
                    disabled={isDisabled}
                    autoComplete="new-password" />
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
 * @param {Object} values — объект с введёнными значениями в поля формы
 * @param {Function} setServerErr — функция куда нужно передать текст ошибки отданной сервером.
 * @param {Function} setNotification — функция отрисовывающая уведомление.
 * @param {Function} dispatch — диспатчер экшен-функции.
 */
export async function onSubmitHandler(values, setServerErr, setNotification, dispatch) {
    
    // По какому адресу буду делать запрос на регистрацию пользователя
    const apiUrl = '/api/v1/users/signup'
    
    // Параметры запроса
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...values
        })
    }
    
    // Сделаю запрос на сервер и полученные данные помещу в serverRes
    const serverRes = await fetch(apiUrl, options)
        .then(res => res.json())
        .then(res => res)
        .catch(err => console.log(err))
    
    /* Если в serverRes будет объект с ошибкой про неверные данные от пользователя если указан не верная почта или пароль или они вообще не переданы,
    то показать сообщение об ошибке:
    {
        "status": "fail",
        "error": {
            "statusCode": 400,
            "isOperational": true,
            "message": "Incorrect email or password"
        },
        "message": "Please provide email and password.",
    }*/
    if(serverRes.status === 'error' && serverRes.error.statusCode === 400) {
        setServerErr(
            <Error text={serverRes.error.message} indent='3' />
        )
    }
    
    /* Если в serverRes будет объект с успешным статусом, то показать уведомление с просьбой подтвердить почту:
    {
        "status": "success",
        "data": {
            "user": {
                "name": "Andrew Kozinsky",
                "email": "andkozinskiy@yandex.ru",
            }
        }
    }*/
    if(serverRes.status === 'success') {
        const mailService = 'https://' + values.email.split('@')[1]
        setNotification(
            <Notification>A letter with a link has been sent to your <a href={mailService}>email</a>. Click on it to log in your account.</Notification>
        )
    }
    
}