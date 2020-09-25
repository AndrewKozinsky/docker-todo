import React from 'react'
import s from './css/authSplitContainer.scss'


function AuthSplitContainer({children}) {
    
    return <section className={s.wrapper}>
        <div className={s.leftPart} />
        <div className={s.rightPart}>
            {children}
        </div>
    </section>
}

export default AuthSplitContainer