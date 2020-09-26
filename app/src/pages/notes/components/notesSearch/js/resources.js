import React from 'react'
import {Form} from "formik"
import TextInput from "../../../../../components/formElements/textInput"


/**
 * Функция возвращает отрисовываемую форму
 * @param {Object} formik — объект с со свойствами и методами возаращаемыми библиотекой Formik
 * @param {Function} getValues —
 * В этой функции она постоянно будет запускаться в значении null
 * чтобы после любого изменения формы текст ошибки сервера бы скрывался.
 * @returns {*}
 */
export function createForm(formik, getValues) {
    
    return (
        <Form onChange={(values) => getValues(values)}>
            <TextInput type='search' name='search' />
        </Form>
    )
}