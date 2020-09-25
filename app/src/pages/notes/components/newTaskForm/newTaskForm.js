import React, {useRef, useEffect} from 'react'
import {useDispatch} from "react-redux"
import {formSubmit} from "./js/resources"
import s from './css/newTaskForm.scss'


function NewTaskForm() {
    const dispatch = useDispatch()
    const inputRef = useRef(null)
    
    // Поставить фокус на поле ввода при отрисовке компонента
    useEffect(() => {
        inputRef.current.focus()
    }, [])
    
    // Обработчик отправки формы
    function formSubmitHandler(e) {
        formSubmit(e, inputRef, dispatch)
    }
    
    return (
        <form className={s.form} onSubmit={formSubmitHandler}>
            <input type="text" className={s.input} placeholder='A new deal' ref={inputRef}/>
        </form>
    )
}


export default NewTaskForm