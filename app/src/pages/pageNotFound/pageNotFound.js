import React from 'react';
import logo from './svg/logo.svg'
import s from './css/pageNotFound.scss'
import {Link} from "react-router-dom";

function PageNotFound() {

    return (
        <div className={s.pageWrapper}>
            <img src={logo} className={s.logo} alt='Todo service logotype' />
            <h1 className={s.header}>Page Not Found</h1>
            <p className={s.text}>If you think this page should be, write about it to <Link to='mailto:mail@andrewkozinsky.ru'>mail@andrewkozinsky.ru</Link>.</p>
            <p className={s.text}>Or go to the <Link to='/'>main page</Link>.</p>
        </div>
    )
}

export default PageNotFound;