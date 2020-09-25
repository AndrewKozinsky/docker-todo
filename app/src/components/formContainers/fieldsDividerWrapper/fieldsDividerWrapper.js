import React from 'react'
import s from './css/fieldsDeviderWrapper.scss'


function FieldsDividerWrapper(props) {
    
    const {
        children,
        indent
    } = props;
    
    let cls = ''
    if (indent * 1 === 2) cls += s.indent_2
    if (indent * 1 === 3) cls += s.indent_3
    
    return <div className={cls}>{children}</div>
}

export default FieldsDividerWrapper