import React from 'react';
import s from './css/spinner.scss'

const Spinner = ({text}) => {
    
    let label = text ? <p className={s.label}>{text}</p> : null
    
    return <div className={s.wrapper}>
        <div className={s.nest} />
        {label}
    </div>
}

export default Spinner