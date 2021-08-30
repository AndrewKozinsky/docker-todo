// const catchAsync = require('../utils/catchAsync')
// const AppError = require('../utils/appError')
// const Note = require('../mongooseModels/note')

// Функция корректирующая объект запроса Монгуса в зависимости
// от переданных подзапросов в адресной строке.
/*const handleGetNotesQuery = (query, queryObj) => {
    if(!queryObj) return query;
    
    if(queryObj.search) {
        const regExp = new RegExp(queryObj.search, 'gi')
        query = query.find({
            text: regExp
        })
    }
    
    if(queryObj.important) {
        const importantStatus = queryObj.important === '1'
        query = query.find({
            important: importantStatus
        })
    }
    
    if(queryObj.page) {
        const page = queryObj.page * 1 || 1
        const limit = queryObj.limit * 1 || 3
        const skip = (page - 1) * limit;
    
        query = query.skip(skip).limit(limit);
    }
    
    return query
}*/

// Получение всех заметок текущего пользователя
/*exports.getMyNotes = catchAsync(async (req, res, next) => {
    
    // Сформирую объект запроса
    let query = Note
        .find({ userId: req.user.id })
        .select('-__v')
        .sort({ timeStamp: 'desc' })
    
    // Обработать подзапрос переданный в адресной строке
    query = handleGetNotesQuery(query, req.query)
    
    // Уберу из выборки поле userId
    query.select('-userId -date')
    
    // Получу все заметки пользователя
    const notes = await query;

    res.status(200).json({
        status: 'success',
        results: notes.length,
        data: {
            notes
        }
    })
})*/


// Создание заметки текущего пользователя
/*exports.createMyNote = catchAsync(async (req, res, next) => {
    
    // Получу из тела запроса данные новой заметки
    const {
        text,
        timeStamp,
        important = false
    } = req.body
    
    
    // Если текст не передан, то выбросить ошибку
    if(!text) {
        return next(
            new AppError('You did not provide text on the note', 400)
        )
    }
    
    // Создание новой заметки
    await Note.create({
        text,
        important,
        timeStamp,
        userId: req.user.id
    })
    
    res.status(200).json({
        status: 'success',
        data: {
            note: {
                text,
                important: important,
                timeStamp,
            }
        }
    })
})*/


// Обновление конкретной заметки пользователя
/*exports.updateMyNote = catchAsync(async (req, res, next) => {
    
    // Уберу поля, которые нельзя изменять
    const newUpdateObj = {...req.body}
    const excludeFields = ['_id timeStamp userId']
    excludeFields.forEach(el => delete newUpdateObj[el])
    
    // Обновлю поля
    const newNote = await Note.findOneAndUpdate(
        {timeStamp: req.params.timeStamp}, newUpdateObj, {new: true}
    )
    
    // Отправить успешный ответ
    res.status(200).json({
        status: 'success',
        data: {
            note: newNote
        }
    })
})*/


// Удаление конкретной заметки пользователя
/*exports.deleteMyNote = catchAsync(async (req, res, next) => {
    
    await Note.findOneAndDelete({timeStamp: req.params.timeStamp})
    
    res.status(204).json({
        status: 'success',
        data: null
    })
})*/


// Получение статистики по количеству заметок
/*
exports.getMyNotesStatistics = catchAsync(async (req, res, next) => {
    
    const totalCount = await Note.aggregate([
        {
            $group: {
                _id: null,
                total: {$sum: 1},
            }
        }
    ]);
    
    const importantCount = await Note.aggregate([
        {
            $match: {important: true}
        },
        {
            $group: {
                _id: null,
                important: {$sum: 1},
            }
        }
    ])
    
    const stats = {
        total: totalCount[0].total,
        importantCount: importantCount[0].important
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    })
})*/
