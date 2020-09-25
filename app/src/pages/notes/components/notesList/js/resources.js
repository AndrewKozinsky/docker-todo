import {
    changeNoteImportantStatus,
    deleteNote,
    changesNotesSaveStatus
} from "../../../../../store/actions"

/**
 * Функция получает массив заметок пользователя с сервера
 * @returns {Promise<{notes: [], areNotesSaved: boolean}|[]|*[]>}
 */
export async function getNotesFromServer() {
    
    // По какому адресу буду делать запрос
    const apiUrl = '/api/v1/myNotes'
    
    // Параметры запроса
    const options = { method: 'GET' }
    
    // Сделаю запрос на сервер и полученные данные помещу в serverRes
    const serverRes = await fetch(apiUrl, options)
        .then(res => res.json())
        .then(res => res)
        .catch(err => console.log(err))
    
    return serverRes.data.notes
}

/**
 * Функция делает заметку важной/неважной и в Хранилище и на сервере
 * @param {String} timeStamp — временная метка когда создана заметка
 * @param {Boolean} isImportant — должна ли заметка стать важной
 * @param {Function} dispatch — функция dispatch
 * @returns {Promise<void>}
 */
export async function changeNoteStatusEverywhere(timeStamp, isImportant, dispatch) {
    // Сделать заметку важной/неважной в Хранилище
    dispatch(changeNoteImportantStatus(timeStamp))
    
    // Добавить сообщение о процессе сохранения данных
    dispatch(changesNotesSaveStatus(false))
    
    // Сделать заметку важной/неважной на сервере...
    
    // По какому адресу буду делать запрос
    const apiUrl = '/api/v1/myNotes/' + timeStamp
    
    // Параметры запроса
    const options = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            important: isImportant
        })
    }
    
    // Сделаю запрос на сервер и полученные данные помещу в serverRes
    const serverRes = await fetch(apiUrl, options)
        .then(res => res.json())
        .then(res => res)
        .catch(err => console.log(err))
    
    // Добавить сообщение о успешном сохранении данных
    dispatch(changesNotesSaveStatus(true))
}


export async function deleteNoteEverywhere(timeStamp, dispatch) {

    // Удалить заметку из Хранилища
    dispatch(deleteNote(timeStamp))
    
    // Добавить сообщение о процессе сохранения данных
    dispatch(changesNotesSaveStatus(false))
    
    // По какому адресу буду делать запрос
    const apiUrl = '/api/v1/myNotes/' + timeStamp
    
    // Параметры запроса
    const options = {
        method: 'DELETE'
    }
    
    // Сделаю запрос на сервер и полученные данные помещу в serverRes
    const serverRes = await fetch(apiUrl, options)
        .then(res => res.json())
        .then(res => res)
        .catch(err => console.log(err))
    
    // Добавить сообщение о успешном сохранении данных
    dispatch(changesNotesSaveStatus(true))
}

// Функция анимации какого-то значения в процессе времени
export function animate(opts) {
    let start = new Date; // сохранить время начала
    
    let timer = setInterval(function() { // в timer хранится id таймера чтобы потом, когда анимацию нужно будет завершить, его передать как атрибут фукнции clearInterval()
        
        // вычислить сколько времени прошло
        let progress = (new Date - start) / opts.duration; // Получил число от 0 до 1
        if (progress > 1) progress = 1; // Если больше одного, то равно 1
        
        // отрисовать анимацию
        opts.step(progress); // Запуск функции отрисовывающей новый кадр анимации. Фактически в progress находится процентное значение прошедшей анимации.
        
        if (progress === 1) clearInterval(timer); // Если progress == 1, тогда завершить анимацию
        
    }, opts.delay || 10); // по умолчанию кадр каждые 10мс. Поэтому это свойство можно не указывать в передаваемом объекте.
}
