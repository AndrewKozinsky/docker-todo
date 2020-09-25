const mongoose = require('mongoose')
const {db} = require('../config')

exports.connectDb = function() {
    mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    return mongoose.connection
}


// Настройка Монгуса чтобы не ругался
// mongoose.set('useCreateIndex', true)
// --mongoose.set('useFindAndModify', false)