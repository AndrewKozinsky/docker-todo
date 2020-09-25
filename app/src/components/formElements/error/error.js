import React from 'react'
import './css/error.scss'


function Error(props) {
    const {
        text = `Error message didn't pass`, // Текст ошибки
        indent,
    } = props
    
    let cls = 'error'
    if(indent * 1 === 1) cls += ' error--padding-1'
    if(indent * 1 === 2) cls += ' error--padding-2'
    if(indent * 1 === 3) cls += ' error--padding-3'
    
    return <p className={cls}>{text}</p>
}


export default Error