import React from 'react'
import {useDispatch, useSelector} from "react-redux"
import RadioButtonsGroup from "../../../../components/formElements/radioButtonsGroup"
import {changeDisplayedType} from "../../../../store/actions"


function NotesSwitcher() {
    
    const dispatch = useDispatch()
    
    // Получу все заметки
    const {allNotes, displayedType} = useSelector(store => store.notes)
    
    const [totalCount, importantCount] = getStatistics(allNotes)
    
    function changeType(type) {
        return dispatch(changeDisplayedType(type))
    }
    
    const buttonsPropsArr = [
        {text: 'All', sign: 'check-all', counter: totalCount, onClick: changeType.bind(null, 'all')},
        {text: 'Selected', sign: 'sun', counter: importantCount, onClick: changeType.bind(null, 'important')}
    ]
    
    const currentTab = displayedType === 'all' ? 0 : 1
    
    return (
        <div>
            <RadioButtonsGroup btnsPropsArr={buttonsPropsArr} current={currentTab} />
        </div>
    )
}


function getStatistics(allNotes) {
    let totalCount = 0, importantCount = 0
    
    allNotes.forEach(note => {
        totalCount += 1
        
        if(note.important) importantCount += 1
    })
    
    return [totalCount, importantCount]
}

export default NotesSwitcher