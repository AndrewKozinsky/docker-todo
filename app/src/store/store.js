import {createStore} from "redux"
import {
    setUser,
    setAuthTokenStatus,
    addAllNotes,
    addDisplayedNotes,
    changeDisplayedType,
    addNote,
    changeNoteImportantStatus,
    deleteNote,
    setNotesCurrentPage,
    changesNotesSaveStatus,
    setSearchStr
} from './reducers'


const inicialState = {
    user: {
        name: null,
        email: null,
        // Есть ли в браузере токен. Если 0, то не известно.
        // Если 1, то нет или он неверный. Если 2, то правильный.
        authTokenStatus: 0
    },
    notes: {
        areNotesSaved: true, // Идёт ли сейчас сохранение заметок
        currentPage: 0, // Текущая показываемая страница в заметках
        notesPerPage: 5, // Сколько заметок показывается на одной странице
        searchStr: '', // Какой текст ищут
        displayedType: 'all', // Какой тип заметок показывается: all (все) или important (важные)
        // Все заметки
        allNotes: [
            /*{
                text: 'Сделай программу на Реакте и Ноде где задачи были бы написаны огромным шрифтом. Думаю это будет выглядеть интересно.',
                important: false,
                timeStamp: 635643223671
            },
            {
                _id: 2,
                text: 'Может вместо видео делать текстовые статьи?',
                important: true,
                timeStamp: 635643223672
            }*/
        ],
        // Показываемые заметки
        displayedNotes: []
    }
}


function reducer(state = inicialState, action) {
    switch (action.type) {
        case 'SET_USER':
            return setUser(state, action)
        case 'SET_AUTH_TOKEN_STATUS':
            return setAuthTokenStatus(state, action)
        case 'ADD_ALL_NOTES':
            return addAllNotes(state, action)
        case 'ADD_DISPLAYED_NOTES':
            return addDisplayedNotes(state, action)
        case 'CHANGE_DISPLAYED_TYPE':
            return changeDisplayedType(state, action)
        case 'ADD_NOTE':
            return addNote(state, action)
        case 'CHANGE_NOTE_IMPORTANT_STATUS':
            return changeNoteImportantStatus(state, action)
        case 'DELETE_NOTE':
            return deleteNote(state, action)
        case 'SET_NOTES_CURRENT_PAGE':
            return setNotesCurrentPage(state, action)
        case 'CHANGE_NOTES_SAVE_STATUS':
            return changesNotesSaveStatus(state, action)
        case 'SET_SEARCH_STR':
            return setSearchStr(state, action)
        default:
            return state
    }
}

export default createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())