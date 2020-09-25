export function setUser(state, action) {
    const copyState = {...state}
    const copyUser = {...copyState.user}
    
    if(action.name) copyUser.name = action.name
    if(action.email) copyUser.email = action.email
    
    copyState.user = copyUser
    
    return copyState
}

export function setAuthTokenStatus(state, action) {
    const copyState = {...state}
    const copyUser = {...copyState.user}
    
    copyUser.authTokenStatus = action.status
    
    copyState.user = copyUser
    
    return copyState
}

export function addAllNotes(state, action) {
    const copyState = {...state}
    const copyNotes = {...copyState.notes}
    
    copyNotes.allNotes = action.notesArr
    
    copyState.notes = copyNotes
    return copyState
}

export function addDisplayedNotes(state, action) {
    const copyState = {...state}
    const copyNotes = {...copyState.notes}
    
    copyNotes.displayedNotes = action.notesArr
    
    copyState.notes = copyNotes
    return copyState
}

export function changeDisplayedType(state, action) {
    const copyState = {...state}
    const copyNotes = {...copyState.notes}
    
    copyNotes.displayedType = action.displayedType
    
    // Если перешли на избранные заметки, то поставить первую страницу
    if(action.displayedType === 'important') {
        copyNotes.currentPage = 0
    }
    
    copyState.notes = copyNotes
    return copyState
}


export function addNote(state, action) {
    const copyState = {...state}
    const copyNotes = {...copyState.notes}
    const copyAllNotes = [...copyNotes.allNotes]
    
    const newNote = {
        text: action.text,
        important: false,
        timeStamp: Date.now() // Время создания заметки
    }
    
    copyAllNotes.unshift(newNote)
    copyNotes.allNotes = copyAllNotes
    copyNotes.currentPage = 0
    copyState.notes = copyNotes
    
    return copyState
}

export function changeNoteImportantStatus(state, action) {
    const copyState = {...state}
    const copyNotes = {...copyState.notes}
    const copyAllNotes = [...copyNotes.allNotes]
    
    const noteIdx = copyAllNotes.findIndex(note => note.timeStamp === action.timeStamp)
    copyAllNotes[noteIdx].important = !copyAllNotes[noteIdx].important
    
    copyNotes.allNotes = copyAllNotes
    copyState.notes = copyNotes
    
    return copyState
}

export function deleteNote(state, action) {
    const copyState = {...state}
    const copyNotes = {...copyState.notes}
    
    // Создам новый массив через фильтрацию существующего массива заметок
    copyNotes.allNotes = copyNotes.allNotes
        .filter(note => note.timeStamp !== action.timeStamp)
    
    copyState.notes = copyNotes
    return copyState
}

export function setNotesCurrentPage(state, action) {
    const copyState = {...state}
    const copyNotes = {...copyState.notes}
    
    copyNotes.currentPage = action.pageNum
    
    copyState.notes = copyNotes
    return copyState
}

export function changesNotesSaveStatus(state, action) {
    const copyState = {...state}
    const copyNotes = {...copyState.notes}
    
    copyNotes.areNotesSaved = action.areNotesSaved
    
    copyState.notes = copyNotes
    
    return copyState
}

export function setSearchStr(state, action) {
    const copyState = {...state}
    const copyNotes = {...copyState.notes}
    
    copyNotes.searchStr = action.str
    
    copyState.notes = copyNotes
    
    return copyState
}
