import React from 'react'
import {useDispatch} from "react-redux"
import {Formik} from "formik"
import {setSearchStr} from "../../../../store/actions"
import {createForm} from "./js/resources"


function NotesSearch() {
    const dispatch = useDispatch()
    
    const getValues = (e) => {
        const inputValue = e.target.value
        
        dispatch(setSearchStr(inputValue))
    }
    
    return (
        <Formik
            initialValues={{search: ''}}
            onSubmit={() => {
            
            }}
        >
            { formik => createForm(formik, getValues) }
        </Formik>
    )
}

export default NotesSearch





