import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom"
import './css/reset.css'
import './css/general.scss'
import s from './css/app.scss'

import MainPage from '../../pages/main'
import EntrancePages from '../../pages/entrance'
import UserAreaPages from '../../pages/userArea'
import MessagePage from '../../pages/messagePage'
import PageNotFound from '../../pages/pageNotFound'


function App() {
    return (
        <Router>
            <div className={s.app}>
                <Switch>
                    <Route path='/' exact>
                        <MainPage />
                    </Route>
                    {/*<Route path='/(reg|enter|forgot-password)'>
                        <EntrancePages />
                    </Route>*/}
                    {/*<Route path='/reset-password/:token'>
                        <EntrancePages />
                    </Route>*/}
                    {/*<Route path='/(notes|user)'>
                        <UserAreaPages />
                    </Route>*/}
                    {/*<Route path='/message' exact>
                        <MessagePage />
                    </Route>*/}
                    <Route path="*">
                        <PageNotFound />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}


export default App
