const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const crypto = require('crypto')
const User = require('../mongooseModels/user')
const authToken = require('./authToken')
const {sendEmailAddressConfirmLetter} = require("./authController")
const {
    createSendToken,
    sendResponseWithAuthToken
} = require('./authToken')


/**
 * Функция получает объект и возвращает объект с разрешёнными свойствами
 * @param {Object} obj — исходный объект
 * @param {Array} allowedFields — массив с именами разрешённых свойств
 * @returns {Object} — функция возвращает объект с разрешёнными свойствами
 */
const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) {
            newObj[el] = obj[el]
        }
    })
    
    return newObj;
}

// Обработчик маршрута изменения почты текущего пользователя
exports.changeMyEmail = catchAsync(async (req, res, next) => {
    // Получу новую почту
    const newEmail = req.body.email
    
    // Если почту не передали, то бросить ошибку
    if(!newEmail) {
        return next(
            new AppError(`Cannot change email because it didn't pass.`, 400)
        )
    }
    
    // Если передали такую же почту, то ничего не делать
    if(newEmail === req.user.email) {
        return next(
            new AppError(`Existing email was passed. Write new one to change existing one.`, 400)
        )
    }
    
    // Создам токен подтверждения почты
    const emailConfirmToken = crypto.randomBytes(32).toString('hex');
    
    // Найду текущего пользователя и обновлю его почту
    const user = await User.findOneAndUpdate(
        {email: req.user.email},
        {
            email: newEmail,
            emailConfirmToken: emailConfirmToken,
        },
        {new: true}
    ).select('-_id -emailConfirmToken -__v -passwordChangedAt')
    
    // Отправлю письмо с подтверждением почты
    await sendEmailAddressConfirmLetter(req, req.body.email, emailConfirmToken)
    
    // Удалю куку авторизации
    res.cookie('authToken', 'loggedout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    })
    
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})


// Функция отправляет данные пользователя по его токену
exports.getMe = catchAsync(async (req, res, next) => {
    return res.status(200).json({
        status: 'success',
        data: {
            user: {
                email: req.user.email,
                name: req.user.name
            }
        }
    })
})


// Функция обновляет данные пользователя
exports.updateMe = catchAsync(async (req, res, next) => {
    // Если передают пароль или почту, то ответить, что этот маршрут не для изменения пароля и почты
    if(req.body.password || req.body.passwordConfirm || req.body.email) {
        return next(
            new AppError('This route is not for password or email update. Please use suitable route.', 400)
        )
    }

    // Отфильтрую данные чтобы получить только разрешённые для изменения свойства.
    // Пока разрешно только менять имя.
    const filteredBody = filterObj(req.body, 'name')
    
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {new: true, runValidators: true}
    ).select('-emailConfirmToken -passwordChangedAt -__v -_id')
    
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})


// Функция изменения пароля текущего пользователя, который помнит свой пароль
exports.updateMyPassword = catchAsync(async (req, res, next) => {
    // Получу данные текущего пользователя вместе с паролем.
    const user = await User.findById(req.user.id).select('+password')
    
    // Если пользователь ввёл неверный текущий пароль, то бросить ошибку
    if(!await user.correctPassword(req.body.passwordCurrent, user.password)) {
        return next(
            new AppError('Your current password is wrong', 401)
        )
    }
    
    // Поставить новый пароль в данные пользователя
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    
    // Соханить пароль в базе данных
    await user.save()
    
    // Сотру пароли чтобы они не попали в возвращаемый результат
    user.password = undefined
    user.passwordConfirm = undefined
    
    // Создать объект ответа с токеном пользователя
    const resWithToken = createSendToken(user, res)
    
    // Отправить данные пользователя
    sendResponseWithAuthToken(user, resWithToken)
})


// Функция удаляет пользователя
exports.deleteMe = catchAsync(async (req, res, next) => {
    
    // Удалить пользователя из БД
    await User.findByIdAndDelete(
        req.user.id
    )
    
    // Обнулить куку авторизации
    res.cookie('authToken', 'loggedout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    })
    
    res.status(204).json({
        status: 'success',
        data: {
            data: 1
        }
    })
})