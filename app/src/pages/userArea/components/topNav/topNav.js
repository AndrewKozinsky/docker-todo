import React from 'react'
import {useDispatch, useSelector} from "react-redux"
import {useRouteMatch} from "react-router-dom"
import {setAuthTokenStatus} from "../../../../store/actions"
import Button from "../../../../components/formElements/button"
import s from './css/topNavigation.scss'


// Компонент верхней навигации
function TopNav() {
    const dispatch = useDispatch()
    
    // Получу имя пользователя
    const {name} = useSelector(state => state.user)

    return (
        <nav className={s.wrapper}>
            <SavedStatus />
            <TopNavLink tag='a' to='/notes' label='Notes' sign='notes' i='1' />
            <TopNavLink tag='a' to='/user' label={name} sign='person' i='2' />
            <TopNavLink to='/enter' label='Log out' sign='exit' onClick={() => logOut(dispatch)} i='3' />
        </nav>
    )
}

// Компонент подписи про статус сохранения
function SavedStatus() {
    
    // Статус сохранены ли заметки или еще нет
    const {areNotesSaved} = useSelector(state => state.notes)
    
    // Если я нахожусь не на странице /notes, то компонент ничего не возвращает
    let match = useRouteMatch('/notes');
    if(!match) return null
    
    // В зависимости от статуса сделаю различные классы
    let cls = s.saveStatus + ' '
    cls += areNotesSaved ? s.notesSaved : s.notesAreSaving
    
    // В зависимости от статуса будет разный текст
    const text = areNotesSaved ? 'All changes were saved' : 'Notes being saved'
    
    return <p className={cls}>{text}</p>
}

// Кнопка навигации
function TopNavLink({ tag, to, label, sign, onClick, i }) {
    let match = useRouteMatch(to);
    
    const attrs = {
        tag,
        href: to,
        text: label,
        sign,
        onClick,
        i
    }
    
    if(!match) attrs.mode1 = true
    
    return <Button {...attrs} />
}

// Обработчик щелчка по кнопке выхода пользователя из учётной записи
function logOut(dispatch) {
    
    try {
        // Нужно удалить куку с токеном авторизации. Для этого сделаю запрос на API к адресу
        const apiUrl = '/api/v1/users/logout'
    
        // Сделаю запрос на сервер и полученные данные помещу в serverRes
        const serverRes = fetch(apiUrl, { method: 'GET' })
            .catch(err => new Error('Something went wrong'))
    
        dispatch(setAuthTokenStatus(1))
    }
    catch (err) {
        console.error(new Error('Something went wrong'))
    }
}


export default TopNav