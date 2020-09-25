import React from "react";
import s from './css/notification.scss'


function Notification(props) {
    const {
        children,
        topIndent, // Пока доступно значение 1
    } = props
    
    let cls = s.wrapper;
    if(topIndent) cls += ' ' + s.topPadding_1
    
    return <p className={cls}>
        {children}
    </p>
}

export default Notification