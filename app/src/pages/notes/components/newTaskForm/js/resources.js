import {addNote, changesNotesSaveStatus} from "../../../../../store/actions"


export function formSubmit(e, inputRef, dispatch) {
    // Отменить переход на другую страницу
    e.preventDefault()
    
    // Поле добавления новой заметки и её значение
    const inputEl = inputRef.current
    const inputVal = inputEl.value
    
    // Если ничего не ввели, то завершить функцию
    if(inputVal === '') return
    
    // Добавить новую заметку в Хранилище
    dispatch(addNote(inputVal))
    
    // Очистить поле добавления заметки
    inputEl.value = ''
    
    // Добавить сообщение о процессе сохранения данных
    dispatch(changesNotesSaveStatus(false))
    
    // TODO предусмотри случай когда отключен интернет
    // Проверяется так: navigator.onLine
    // Может в этом случае заметку сохранять в LocalStorage?
    
    // Добавить новую заметку на сервере
    addNewNoteAtServer(inputVal).then(() => {
        // Добавить сообщение о процессе сохранения данных
        dispatch(changesNotesSaveStatus(true))
    })
}


async function addNewNoteAtServer(noteText) {
    // По какому адресу буду делать запрос
    const apiUrl = '/api/v1/myNotes'
    
    // Параметры запроса
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text: noteText,
            timeStamp: Date.now()
        })
    }
    
    // Сделаю запрос на сервер и полученные данные помещу в serverRes
    const serverRes = await fetch(apiUrl, options)
        .then(res => res.json())
        .then(res => res)
        .catch(err => console.log(err))
}
