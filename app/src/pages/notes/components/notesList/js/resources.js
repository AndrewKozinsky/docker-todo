import axios from 'axios'
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

    let serverRes = await axios({
        method: 'get',
        withCredentials: true, // ?
        url: apiUrl
    })
    
    return serverRes.data.data.notes
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
    
    // Сделать запрос на изменение статуса заметки
    await axios({
        method: 'patch',
        url: apiUrl,
        withCredentials: true, // ?
        data: {
            important: isImportant
        }
    })
    
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
    
    await axios({
        method: 'delete',
        withCredentials: true,
        url: apiUrl
    })
    
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
