const nodemailer = require('nodemailer')
const sendpulse = require('sendpulse-api')
const EmailTemplate = require('./emailTemplate')
const config = require('../../config')


module.exports = class Email {
    constructor(email, host) {
        this.to = email // На какой адрес отправлять письмо
        this.from = config.email_from // От кого письмо
        this.host = host // Домен сайта
    }
    
    // Функция отправляет письмо с просьбой подтвердить почтовый адрес
    async sendConfirmLetter(confirmUrl) {
        // Тема письма
        const subject = 'Confirm your email for registration at ToDo'
        
        // Создать html и текстовую версию письма
        const [html, text] = new EmailTemplate(this.host).createConfirmLetter(confirmUrl)
        
        // Послать письмо
        this.send(subject, html, text)
    }
    
    // Функция отправляет письмо со ссылкой на сброс пароля
    async sendResetPasswordLetter(resetUrl) {
        const subject = 'Your password reset token (valid for 10 minutes)'
        const [html, text] = new EmailTemplate(this.host).createResetPasswordLetter(resetUrl)
        this.send(subject, html, text)
    }
    
    // Общая функция отправки письма.
    // В зависимости от режима сервера отправляет письма либо на mailtrap.io либо на реальный адрес
    send(subject, htmlContent, textContent) {
        
        // Послать письма разными сервисами в зависимости от режима работы
        if(config.work_mode === 'development') {
            this.sendFakeEmail(subject, htmlContent, textContent)
        }
        else if(config.work_mode === 'production') {
            this.sendRealEmail(subject, htmlContent, textContent)
        }
    }
    
    // Функция отправляющая письма на mailtrap.io
    async sendFakeEmail(subject, html, text) {
        
        // Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text
        }
    
        // Create a transport
        const transport = nodemailer.createTransport({
            host: config.email_host,
            port: config.email_port,
            auth: {
                user: config.email_username,
                pass: config.email_password
            }
        })
        
        // 3) Send email
        await transport.sendMail(mailOptions)
    }
    
    // Функция отправляющая письма на реальный адрес пользователя
    sendRealEmail(subject, html, text) {
        const userId = config.sendpulse_api_user_id
        const secret = config.sendpulse_api_secret
        const tokenStorage = config.sendpulse_token_storage
        
        sendpulse.init(userId, secret, tokenStorage, (token) => {
        
            // Функция сообщающая результат отправки письма
            // В неё первым аргументом попадёт объект отчёта об отправке
            function answerGetter(data) { }
        
            let email = {
                html,
                text,
                subject,
                'from' : {
                    'name' : 'To Do App',
                    'email' : this.from
                },
                'to' : [
                    { "email" : this.to }
                ]
            };
        
            sendpulse.smtpSendMail(answerGetter, email);
        })
    }
}
