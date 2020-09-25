import React from 'react'
import { useField } from 'formik';
import Error from "../error";
import './css/textInput.scss'


function TextInput({ label, ...props }) {
    
    const [field, meta] = useField(props)
    
    let [labelEl, id] = createLabel(label)
    
    let cls = 'text-input'
    if(props.type === 'search') cls += ' text-input--search'
    
    
    return <>
        {labelEl}
        <input
            className={cls}
            {...field}
            type={props.type}
            id={id}
            placeholder={props.placeholder}
            autoComplete={props.autoComplete}
            disabled={props.disabled}
        />
        {meta.touched && meta.error
            ? <Error text={meta.error} indent={1} />
            : null}
    </>
}

function createLabel(label) {
    if(!label) return [null, undefined]
    
    const randomStr = 'key-' + Math.round( (Math.random() * 10000) )
    
    const labelEl = <label className='input-label' htmlFor={randomStr}>{label}</label>
    
    return [labelEl, randomStr]
}


export default TextInput