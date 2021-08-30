// const mongoose = require('mongoose')
// const validator = require('validator')
// const bcrypt = require('bcryptjs')
// const crypto = require('crypto')

// Схема пользователя
/*const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'Please provide a valid email'],
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    emailConfirmToken: String,
    password: {
        type: String,
        required: [true, 'Please provide a password. A password must have at least 4 characters.'],
        minlength: 4,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (passwordConfirm) {
                return this.password === passwordConfirm
            },
            message: 'Passwords are not equal!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
})*/


// Перед сохранением пользователя зашифровать пароль
/*userSchema.pre('save', async function(next) {
    // Завершить функцию если не обновляют пароль
    if(!this.isModified('password')) return next()
    
    // Зашифровать пароль
    this.password = await bcrypt.hash(this.password, 12)
    
    // Удалить поле с подтверждением пароля
    this.passwordConfirm = undefined
})*/

// При изменении пароля записать дату изменения
/*userSchema.pre('save', function (next) {
    if(!this.isModified('password') || this.isNew)
        return next();
    
    this.passwordChangedAt = +Date.now() - 1000
    next()
})*/


// Функция проверяющая идентичность паролей
/*userSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword)
}*/

// Функция проверяет изменился ли пароль пользователя позже, чем переданное время.
// true обозначает, что изменился позже переданного времени
/*userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        
        return JWTTimestamp < changedTimestamp
    }
    
    return false
}*/

// Метод создающий токен сброса пароля
/*userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
    
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    
    return resetToken;
}*/


// const User = mongoose.model('User', userSchema)

// module.exports = User