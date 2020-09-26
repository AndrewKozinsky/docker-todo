import React, {useEffect, useState, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {addAllNotes, addDisplayedNotes} from '../../../../store/actions'
import {
    getNotesFromServer,
    changeNoteStatusEverywhere,
    deleteNoteEverywhere,
    animate
} from './js/resources'
import s from './css/notesList.scss'

/**
 * Компонент списка всех заметок
 * @constructor
 */
function NotesList() {
    const dispatch = useDispatch()
    
    // Получу текущую страницу
    const {
        allNotes,
        currentPage,
        displayedNotes,
        displayedType,
        notesPerPage,
        searchStr
    } = useSelector(store => store.notes)
    
    // При загрузке компонента...
    useEffect(() => {
        // Запросить все заметки с сервера и поставить в Хранилище
        getNotesFromServer()
            .then(notes =>
                dispatch(addAllNotes(notes))
            )
    }, [])
    
    // При изменении массива всех заметок или при изменении текущей страницы
    // вычислить какие заметки должны быть показаны
    useEffect(() => {

        // Создать массив где будут заметки с искомым текстом
        let filteredNotes = allNotes.filter(noteObj => {
            return noteObj.text.toLowerCase()
                .indexOf(searchStr.toLowerCase()) !== -1
        })
        
        // Отфильтрую заметки по типу
        if(displayedType === 'important') {
            filteredNotes = filteredNotes.filter(noteObj => {
                return noteObj.important
            })
        }
        
        // Узнать на сколько нужно порезать массив всех заметок
        // чтобы показывать только требуемые заметки
        const startIndex = currentPage * notesPerPage // Текущая страница умножается на количество показываемых заметок
        const endIndex = (currentPage + 1) * notesPerPage
        
        // Порезать массив показываемых заметок чтобы тут были только заметки,
        // которые нужно показать на странице
        filteredNotes = filteredNotes.slice(startIndex, endIndex)
        
        // Поставить показываемые заметки в Хранилище
        dispatch(addDisplayedNotes(filteredNotes))
        
    }, [allNotes, currentPage, searchStr, displayedType])
    
    // Если заметок нет, то отрисовать соответствующее уведомление
    if(!displayedNotes.length) {
        return <p className={s.notification}>You don't have any notes. Write the first one!</p>
    }
    
    // Если заметки есть, то отрисовать каждую заметку
    return displayedNotes.map(noteObj => {
        return (
            <div className={s.noteWrapper} key={noteObj.timeStamp}>
                <NoteText noteObj={noteObj} />
                <div className={s.noteButtons}>
                    <ImportantBtn noteObj={noteObj} />
                    <DeleteBtn noteObj={noteObj} />
                </div>
            </div>
        )
    })
}


/**
 * Компонент текста заметки
 * @param {Object} noteObj — параметры заметки
 * @returns {*}
 * @constructor
 */
function NoteText({noteObj}) {
    // Классы текста
    let textCls = s.noteText
    // Если заметка важная, то добавить дополнительный класс
    if(noteObj.important) textCls += ' ' + s['noteText--important']
    
    return <p className={textCls}>
        {noteObj.text}
    </p>
}

/**
 * Компонент кнопки изменения важность заметки
 * @param {Object} noteObj — параметры заметки
 * @constructor
 */
function ImportantBtn({noteObj}) {
    const dispatch = useDispatch()
    
    // Классы кнопки
    let cls = s.noteBtn + ' '
    
    // Добавлю дополнительный класс в зависимости от того является ли заметка выделенной или обычной
    cls += !noteObj.important ? s.noteBtnImpOff : s.noteBtnImpOn
    
    // Обработчик нажатия выделяющей кнопки будет разным в зависимости
    // от того является ли заметка выделенной или обычной
    let onBtnClick = !noteObj.important
        ? () => changeNoteStatusEverywhere(noteObj.timeStamp, true, dispatch)
        : () => changeNoteStatusEverywhere(noteObj.timeStamp, false, dispatch)
    
    // Выделяющая кнопка
    return <button
        className={cls}
        onClick={onBtnClick}
    />
}

/**
 * Компонент кнопки удаления
 * @param noteObj
 * @returns {number}
 * @constructor
 */
function DeleteBtn({noteObj}) {
    // Тип кнопки: trash — кнопка удаляющая заметку, countdown — кнопка отменяющая удаление
    let [btnType, setBtnType] = useState('trash')
    
    return btnType === 'trash'
        ? <TrashBtn setBtnType={setBtnType} />
        : <CountdownBtn noteObj={noteObj} setBtnType={setBtnType} />
}

function TrashBtn({setBtnType}) {
    // Классы
    let cls = s.noteBtn + ' ' + s.trashBtn
    
    // Удаляющая кнопка
    return <button
        className={cls}
        onClick={() => setBtnType('counter')}
    />
}

function CountdownBtn({noteObj, setBtnType}) {
    const dispatch = useDispatch()
    
    useEffect(startDeleting, [])
    
    // Ссылка на элемент с красной полоской отсчета времени до удаления
    const redLineRef = useRef(null)
    
    // Разрешена ли анимация счётчика
    let animIsAllowed = true
    
    // ID счётчика после завершения которого заметка будет удалена
    let timeoutId
    
    function startDeleting() {
        redLineRef.current.focus()
        
        animate({
            duration: 1900, // время анимации
            step: function(progress) {
                if(!animIsAllowed) return
                redLineRef.current.style.background = `conic-gradient(red 0deg, red ${progress * 360}deg, transparent ${progress * 360}deg)`
            }
        })
        
        // Удалить заметку из Хранилища и БД через 2 секунды
        timeoutId = setTimeout(() => {
            deleteNoteEverywhere(noteObj.timeStamp, dispatch)
        }, 2000)
    }
    
    // Обработчик отмены удаления
    function cancelDeleting() {
        animIsAllowed = false
        clearInterval(timeoutId)
        setBtnType('trash')
    }
    
    // Классы кнопки
    let btnCls = s.noteBtn + ' ' + s.countdownBtn
    
    return <button className={btnCls} onClick={cancelDeleting}>
        <span className={s.countdownBtn__grayLine} />
        <span className={s.countdownBtn__redLine} ref={redLineRef} />
        <span className={s.countdownBtn__closeSign} />
    </button>
}


export default NotesList