class AppError {
    constructor(message, statusCode) {
        this.statusCode = statusCode || 500
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.isOperational = true
        this.message = message
    }
}

module.exports = AppError;