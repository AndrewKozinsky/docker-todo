import React from 'react'
import Header from "../../components/header"
import DataForm from "./components/dataForm"
import EmailForm from "./components/emailForm";
import PasswordChangingForm from "./components/passwordChangingForm"
import AccountRemoving from "./components/accountRemoving"
import s from './css/userPage.scss'

function UserPage() {
    
    return <>
        <Header text='Your account' />
        
        <div className={s.grid}>
            <div>
                <section className={s.formSection}>
                    <Header text="User's data" tag='h3' type='h3' />
                    <DataForm />
                </section>
                <section className={s.formSection}>
                    <Header text="Email" tag='h3' type='h3' />
                    <EmailForm />
                </section>
            </div>
            <div>
                <section className={s.formSection}>
                    <Header text="Password change" tag='h3' type='h3' />
                    <PasswordChangingForm />
                </section>
            </div>
            <div>
                <section className={s.formSection}>
                    <Header text="Account deletion" tag='h3' type='h3' />
                    <AccountRemoving />
                </section>
            </div>
        </div>
    </>
}

export default UserPage