const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const noteController = require('../controllers/noteController')


// Получение всех заметок текущего пользователя и создание новой
router.route('/')
    .get(authController.protect, noteController.getMyNotes)
    .post(authController.protect, noteController.createMyNote)

// Обновление и удаление конкретной заметки пользователя
router.route('/:timeStamp')
    .patch(authController.protect, noteController.updateMyNote)
    .delete(authController.protect, noteController.deleteMyNote)

// Получение статистики по количеству заметок
/*router.route('/myNotesStatistics')
    .get(authController.protect, noteController.getMyNotesStatistics)*/


module.exports = router