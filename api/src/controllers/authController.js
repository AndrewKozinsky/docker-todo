// const jwt = require('jsonwebtoken')
// const {promisify} = require('util')
// const crypto = require('crypto')
const User = require('../mongooseModels/user')
// const catchAsync = require('../utils/catchAsync')
// const AppError = require('../utils/appError')
// const Email = require('../utils/email/email')
// const {
//     createSendToken,
//     sendResponseWithAuthToken
// } = require('./authToken')
// const config = require('../config')


// Функция отдающая данные по переданному токене. Токен передаётся в куках.
exports.getTokenInfo = async (req, res, next) => {
    let token
    
    // Получу токен из кук
    if(req.cookies && req.cookies.authToken) {
        token = req.cookies.authToken
    }
    
    // Если токен не передан, то возвратить ошибочный ответ
    if(!token) return sendErrorResponse(res)
    
    // Расшифрую JWT и получу payload
    const decoded = await promisify( jwt.verify )(token, config.jwt_secret)
    
    // Получить пользователя
    const currentUser = await User.findById(decoded.id)
    
    // Если пользователь не найден, то вернуть ошибочный ответ
    if(!currentUser) return sendErrorResponse(res)
    
    // Если пароль изменён с последнего захода, то вернуть ошибочный ответ
    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return sendErrorResponse(res)
    }
    
    // Если все проверки прошли мимо, то вернуть положительный ответ вместе с данными пользователя
    res.status(200).json({
        status: 'success',
        data: {
            name: currentUser.name,
            email: currentUser.email
        }
    })
    
    // Функция возвращающая ошибочный ответ
    function sendErrorResponse(res) {
        res.status(200).json({
            status: 'error'
        })
    }
}


// Функция защищающая маршрут от неавторизованных пользователей.
// Если пользователь отправил токен, то программа запускает следующий middleware.
// Если не отправил, то выбрасывает ошибку.
/*exports.protect = catchAsync(async (req, res, next) => {
    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    } else if(req.cookies && req.cookies.authToken) {
        token = req.cookies.authToken
    }
    
    // Если токен не передан, то бросить ошибку
    if(!token) {
        return next(
            new AppError('You are not logged in! Please log in to to get access', 401)
        )
    }
    
    // Расшифрую JWT и получу payload
    const decoded = await promisify( jwt.verify )(token, config.jwt_secret);
    
    // Получить пользователя
    const currentUser = await User.findById(decoded.id).select('+password')
    
    // Проверить существование пользователя
    if(!currentUser) {
        return next(
            new AppError('The user belonging to this token does not longer exists.', 401)
        )
    }
    
    // Проверю что пароль не изменён
    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password! Please log in again.', 401)
        )
    }
    
    // Поставить в req.user данные пользователя
    req.user = currentUser
    
    next()
})*/


// Обработчик регистрации пользователя
/*exports.signUp = catchAsync(async (req, res, next) => {
    
    // Токен подтверждения почты
    const emailConfirmToken = crypto.randomBytes(32).toString('hex')
    
    // Создать нового пользователя
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        emailConfirmToken: emailConfirmToken,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })
    
    // Отправлю письмо с подтверждением почты
    await sendEmailAddressConfirmLetter(req, req.body.email, emailConfirmToken)
    
    // Убрать пароль и токен подтверждения почты.
    newUser.password = undefined;
    newUser.emailConfirmToken = undefined;
    newUser.__v = undefined;
    
    // Создать объект ответа с токеном пользователя
    const resWithToken = createSendToken(newUser, res)
    
    // Отправить данные пользователя
    sendResponseWithAuthToken(newUser, resWithToken)
})*/


// Обработчик подтверждения почты пользователя
/*exports.confirmEmail = catchAsync(async (req, res, next) => {
    
    // Найду пользователя с таким же токеном подтверждения почты
    const user = await User.findOneAndUpdate(
        {emailConfirmToken: req.params.token},
        {emailConfirmToken: undefined},
        {new: true}
    )
    
    // Если пользователь не найден, то отправить страницу перебрасывающую пользователя на страницу где ему сообщат,
    // что пользователь уже подтвердил свою почту или такого пользователя не существует.
    if(!user) {
        return res.status(200).send(createRedirectPage('emailIsNotConfirmed'))
    }
    
    // Пользователь найден...
    
    // Уберу свойство emailConfirmToken у объекта с данными пользователя
    delete user.emailConfirmToken
    
    // Создать объект ответа с токеном пользователя
    const resWithToken = createSendToken(user, res)
    
    // Отправить страницу перебрасывающую пользователя на страницу где ему сообщат,
    // что пользователь успешно подтвердил свою почту.
    resWithToken.status(200).send(createRedirectPage('emailIsConfirmed'))
})*/


// Вход пользователя
/*exports.logIn = catchAsync(async (req, res, next) => {
    
    // Получу почту и пароль из тела запроса
    let {email, password} = req.body;
    
    // Если почту или пароль не передали, то попросить их ввести и завершить функцию
    if(!email || !password) {
        return next(
            new AppError('Please provide email and password.', 400)
        )
    }
    
    // Получу данные пользователя
    const user = await User.findOne({email}).select('+password -__v')
    
    // Если пользователь не найден или пароли не совпадают, то бросить ошибку.
    if(!user || !await user.correctPassword(password, user.password)) {
        return next(
            new AppError('Incorrect email or password', 400)
        )
    }
    
    // Если в данных пользователя в поле emailConfirmToken есть строка,
    // то значит пользователь еще не подтвердил почту. Попросить чтобы подтвердил.
    if(user.emailConfirmToken) {
        return next(
            new AppError('Please, confirm your email.', 403)
        )
    }
    
    // Создать объект ответа с токеном пользователя
    const resWithToken = createSendToken(user, res)
    
    // Отправить данные пользователя
    sendResponseWithAuthToken(user, resWithToken)
})*/

// Выход пользователя
/*exports.logOut = (req, res, next) => {
    res.cookie('authToken', 'loggedout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    })
    
    res.status(200).json({
        status: 'success'
    })
}*/


// Функция создаёт токен сброса пароля, ставит в ссылку изменения пароля и отправляет на почту пользователя.
/*exports.forgotPassword = catchAsync(async (req, res, next) => {
    
    // Получу данные пользователя по переданной почте
    const user = await User.findOne({email: req.body.email})
    
    // Вернуть ошибку если пользователя не найдено
    if(!user) {
        return next(
            new AppError('There is no user with this email address', 404)
        )
    }
    
    // Пользователь найден...
    
    // Создать токен сброса и записать его в свойство passwordResetToken в объект с данными найденного пользователя
    // По этому токену я определю какому пользователю нужно сбрасывать пароль.
    const resetToken = user.createPasswordResetToken()
    
    // Адрес страницы где нужно написать новый пароль
    const resetUrl = req.headers.origin + `/reset-password/${resetToken}`
    
    // Попробовать послать пользователю письмо со сбросом пароля
    try {
        // Создать письмо
        const userEmail = new Email(user.email, req.headers.origin)
        
        // Отправить письмо со сбросом пароля
        await userEmail.sendResetPasswordLetter(resetUrl)
    
        // Сохранить обновлённые данные пользователя
        await user.save({
            validateBeforeSave: false
        })
        
        // Послать положительный ответ
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Email has been sent!'
            }
        })
    }
    // Если не удалось послать письмо со сбросом пароля
    catch (err) {
        // Обросить ошибку
        next(
            new AppError('There was an error sending the email. Try again later', 500)
        )
    }
})*/


// Функция меняет пароль взамен забытого
/*exports.resetPassword = catchAsync(async (req, res, next) => {
    // Зашифрую пароль потому что в БД он хранится зашифрованным
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')
    
    // Найду пользователя по токену смены пароля
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    })
    
    // Бросить ошибку если пользователь не найден.
    if(!user) {
        next(
            new AppError('Token is invalid or has expired', 400)
        )
    }
    
    // Пользователь найден...
    
    // Задам новый пароль и уберу данные для смены пароля
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    
    // Сохранить данные пользователя
    await user.save()
    
    // Создать объект ответа с токеном пользователя
    const resWithToken = createSendToken(user, res)
    
    // Отправить данные пользователя
    sendResponseWithAuthToken(user, resWithToken)
})*/


/**
 * Функция отправляющая письмо со ссылкой подтверждения почты
 * @param {Object} req — объект запроса от клиента
 * @param {String} email — почта пользователю, которую он должен подтвердить
 * @param {String} confirmToken — токен подтверждения почты
 * @returns {Promise<void>}
 */
/*async function sendEmailAddressConfirmLetter(req, email, confirmToken) {
    // В requestFromClient содержится булево значение сделан ли запрос из браузера.
    // Если из браузера, то послать письмо на адрес на клиентской части
    // Если не из браузера, то послать письмо на адрес API
    const confirmUrl = req.headers.origin + `/api/v1/users/confirmEmail/${confirmToken}`
    
    // Создать новое письмо.
    // В конструктор передаётся почта пользователя и URL сайта вида http://todo.local
    const userEmail = new Email(email, req.headers.origin)
    
    // Послать письмо для подтверждения почты
    userEmail.sendConfirmLetter(confirmUrl).then(() => {})
}*/
// exports.sendEmailAddressConfirmLetter = sendEmailAddressConfirmLetter


/*function createRedirectPage(type) {
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Title</title>
        </head>
        <body>
            <script>
                window.location = "/message?type=${type}"
            </script>
        </body>
        </html>`
}*/
