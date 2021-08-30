const config = require('../config')

// Глобальный обработчик ошибок Экспресса
module.exports = function globalErrorHandler (err, req, res, next) {
    
    
    console.log('=======================')
    console.log(err)
    console.log('=======================')
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    let error = {...err}
    
    // Если значение поля должно быть уникальным, но ввели дублирующие значения.
    if(error.code === 11000) error = handleDuplicateFieldsBD(error);
    if(error.errors) error = handleValidationErrorBD(error);
    if(error.name === 'JsonWebTokenError') handleJWTError(error)
    if(error.name === 'TokenExpiredError') handleJWTExpiredError(error)
    
    if(config.work_mode === 'development') {
        sendErrorDev(error, res)
    }
    else if(config.work_mode === 'production') {
        sendErrorProd(error, res)
    }
}

// Функция отправляет ошибочный ответ в режиме разработки
function sendErrorDev(err, res) {
    res
        .status(err.statusCode)
        .json({
            status: err.status,  // fail или error
            error: {
                statusCode: err.statusCode,
                isOperational: err.isOperational,
                message: err.message
            }
        })
}

// Функция отправляет ошибочный ответ в режиме публикации
function sendErrorProd(err, res) {
    
    if(err.isOperational) {
        res
            .status(err.statusCode)
            .json({
                status: err.status,   // fail или error
                error: {
                    statusCode: err.statusCode,
                    message: err.message, // Сообщение об ошибке
                }
            })
    }
    else {
        res
            .status(500)
            .json({
                status: 'error',
                data: {
                    message: 'Something went wrong!', // Сообщение об ошибке
                }
            })
    }
}


// В поле, которое должно быть уникальным, передали повторяющееся значение
function handleDuplicateFieldsBD(err) {
    const value = Object.values(err.keyValue)[0]
    const message = `Duplicate field value: ${value}. Please use another one!`
    
    err.statusCode = 400
    err.message = message
    return err
}

// Ошибка при проверке поля
function handleValidationErrorBD(err) {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid input data: ${errors.join('. ')}`
    
    err.statusCode = 400
    err.message = message
    return err
}

// Ошибка в JWT
function handleJWTError(err) {
    err.statusCode = 401
    err.message = 'Invalid token. Please log in again.'
    return err
}

// В JWT истёк срок действия
function handleJWTExpiredError(err) {
    err.statusCode = 401
    err.message = 'Your token has expired. Please log in again.'
    return err
}
