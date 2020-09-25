import React from "react";
import * as Yup from "yup";
import {Form} from "formik"
import FieldsDividerWrapper from "../../../../../components/formContainers/fieldsDividerWrapper"
import TextInput from "../../../../../components/formElements/textInput"
import Button from "../../../../../components/formElements/button"
import {setUser} from "../../../../../store/actions"
import Notification from "../../../../../components/various/notification"
import Error from "../../../../../components/formElements/error"



// Проверка полей формы
export const validationSchema = Yup.object({
    name: Yup.string()
        .required('This field is required')
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
                <TextInput label='Name' type='text' name='name' disabled={isDisabled} autoComplete="name" />
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
    
    // По какому адресу буду делать запрос на изменение данных
    const apiUrl = '/api/v1/users/me'
    
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
    Если в serverRes будет ошибка, то пользователю удалось отправить форму без написания имени, то показать соответствующее уведомление:
    {
        "status": "error",
        "error": {
            "statusCode": 400,
            "message": "Invalid input data: Please provide your name"
        }
    }*/
    if(serverRes.status === 'error' && serverRes.error.statusCode === 400) {
        setServerErr(
            <Error text={serverRes.error.message} indent='3' />
        )
        
    }
    
    /* Если всё верно, то в serverRes будет объект с успехом:
    {
        "status": "success",
        "data": {
            "user": {
                "name": "Andrew Kozinsky",
                "email": "andkozinskiy@yandex.ru"
            }
        }
    }*/
    if(serverRes.status === 'success') {
        
        // Получить данные пользователя
        const {name} = serverRes.data.user
        
        // Поставить их в Хранилище
        dispatch(setUser(name))
        
        setNotification(
            <Notification topIndent='1'>The name has been saved.</Notification>
        )
    }
}