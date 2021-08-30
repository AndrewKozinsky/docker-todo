// const jwt = require('jsonwebtoken')
// const config = require('../config')

/**
 * Функция возвращает ответ с токеном авторизации
 * @param {Object} res — объект ответа сервера
 * @param {Number} statusCode — код ответа сервера
 * @param {Object} user —
 */
/*function sendResponseWithAuthToken(user, res, statusCode = 200) {
    res.status(statusCode).json({
        status: 'success',
        data: {
            user: {
                name: user.name,
                email: user.email
            }
        }
    })
}*/
// exports.sendResponseWithAuthToken = sendResponseWithAuthToken

/**
 * Функция создающая токен авторизации и ставящая его в куку в объекте ответа сервера.
 * @param user
 * @param {Object} res — объект ответа сервера
 */
/*function createSendToken(user, res) {
    const token = signToken(user._id)
    
    const cookieOptions = {
        expires: new Date(Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    res.cookie('authToken', token, cookieOptions)
    
    return res
}*/
// module.exports.createSendToken = createSendToken

/**
 * Функция создающая токен пользователя по переданному ID
 * @param {String} id — id пользователя
 * @returns {undefined|*}
 */
/*
function signToken(id) {
    return jwt.sign(
        { id },
        config.jwt_secret,
        { expiresIn: config.jwt_expires_in }
    )
}*/
