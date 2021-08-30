const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const userRouter = require('./routes/userRouter')
// const myNotesRouter = require('./routes/myNotesRouter')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')


const app = express()

app.use(cookieParser())


// Сделаю чтобы в свойство body объекта запроса заносились данные присланные в теле запроса
app.use(express.json({limit: '10kb'}))

// Ограничение количества запросов
const rater = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour!'
})
app.use('/', rater)


// Маршруты API
app.use('/users', userRouter);
// app.use('/myNotes', myNotesRouter)
app.get('/test', (req, res) => {
    res.send('Hello!')
})


// Статические файлы на сервере.
app.use(express.static(path.join(__dirname, 'static-files')))


// Обработка несуществующего маршрута
app.all("*", (req, res, next) => {
    next(
        new AppError(`Can't find ${req.originalUrl} on the server!`, 404)
    )
})

// Глобальный обработчик ошибок
app.use(globalErrorHandler)


module.exports = app