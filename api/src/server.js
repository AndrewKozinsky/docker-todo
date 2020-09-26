const config = require('./config')
const {connectDb} = require('./utils/db')

// Выключение сервера при ошибке типа uncaughtException
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION 💥. Shutting down...');
    console.log(err.name, err.message);
    process.exit(1)
})

connectDb()
    .on('error', console.log)
    .on('disconnected', connectDb)
    .once('open', startServer);


function startServer() {
    // Подключение файла app.js с маршрутами
    const app = require('./app')
    
    // Прослушивание порта на сервере
    const server = app.listen(config.port, () => {
        console.log('Server started 🔥 at port ' + config.port)
    })


    // Выключение сервера при ошибке типа unhandledRejection
    process.on('unhandledRejection', err => {
        console.log(err)
        console.log('UNHANDLED REJECTION. 💥 Shitting down...');
        server.close(() => {
            process.exit(1)
        })
    })
}