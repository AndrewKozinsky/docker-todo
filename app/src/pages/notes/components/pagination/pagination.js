// import React, {useEffect} from 'react'
// import {useDispatch, useSelector} from "react-redux"
// import {setNotesCurrentPage} from "../../../../store/actions"
// import Button from "../../../../components/formElements/button"

/*function Pagination() {
    
    const dispatch = useDispatch()
    
    // Получу данные из Хранилища
    let {
        allNotes,
        notesPerPage,
        currentPage,
        displayedType,
        searchStr
    } = useSelector(store => store.notes)
    
    // Функция устанавливающая новую страницу
    const setPage = function(pageNum) {
        dispatch(setNotesCurrentPage(pageNum))
    }
    
    // Отфильтровать заметки на вхождение в искомое слово
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
    
    // Получу количество страниц
    const pagesCount = Math.ceil(filteredNotes.length / notesPerPage)
    
    useEffect(() => {
        if(allNotes.length > 0) {
            // Если текущая страница больше максимальной, то поставить максимальную
            if(currentPage >= pagesCount) {
                dispatch(setNotesCurrentPage(pagesCount - 1))
            }
        }
    }, [allNotes])
    
    // Если страниц нет (нет заметок) или только одна страница, то ничего не отрисовывать.
    if(!pagesCount || pagesCount === 1) return null
    
    // Сформирую массив кнопок переключающих страницы.
    const pagesLinks = []
    for(let i = 0; i < pagesCount; i++) {
        const isMode1 = currentPage !== i
        pagesLinks.push(
            <Button text={i + 1} mode1={isMode1} mode2={true} onClick={setPage.bind(null, i)} key={i} />
        )
    }
    
    return pagesLinks.reverse()
}*/


// export default Pagination