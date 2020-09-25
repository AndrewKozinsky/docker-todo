import React from 'react'
import Button from "../../../../components/formElements/button";
import s from './css/topNavigation.scss'

import { useRouteMatch } from "react-router-dom";


function TopNavEntrance() {
    const regBtn =   <TopNavLink to='/reg' label='Sign up' i='1' />
    const enterBtn = <TopNavLink to='/enter' label='Log in' i='2' />
    
    return <nav className={s.wrapper}>
        {enterBtn}
        {regBtn}
    </nav>
}

function TopNavLink({ label, to, i }) {
    let match = useRouteMatch(to)
    
    const attrs = {
        tag: 'a',
        href: to,
        text: label,
        i
    }
    
    if(!match) attrs.mode1 = true
    
    return <Button {...attrs} />
}

export default TopNavEntrance