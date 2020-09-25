import React from 'react'
import s from './css/header.scss'


function Header(props) {
    const {
        tag = 'h2',
        type = 'h2',
        text
    } = props
    
    // Тег
    const Tag = tag
    
    // Классы
    let cls = ''
    if(type === 'h2') cls += s.h2
    if(type === 'h3') cls += s.h3
    
    return <Tag className={cls}>{text}</Tag>
}

export default Header