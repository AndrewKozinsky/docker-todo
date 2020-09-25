const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Получение данных токена
router.post('/getTokenInfo', authController.getTokenInfo)

// Регистрация пользователя
router.post('/signup', authController.signUp)

// Подтверждение почты пользователя
router.get('/confirmEmail/:token', authController.confirmEmail)

// Вход пользователя
router.post('/login', authController.logIn)

// Выход пользователя
router.route('/logOut')
    .get(authController.protect, authController.logOut)

// Отправка повторного письма подтверждения почты пользователя
// router.post('/sendConfirmEmailLetter', authController.sendAnotherEmailLetter)

// Отправка письма со ссылкой на сброс пароля
router.post('/forgotPassword', authController.forgotPassword)

// Сброс пароля
router.patch('/resetPassword/:token', authController.resetPassword)

router.route('/myEmail')
    .put(authController.protect, userController.changeMyEmail)

// Получение данных пользователя
router.route('/me')
    .get(authController.protect, userController.getMe)

// Обновление данных пользователя
router.route('/me')
    .patch(authController.protect, userController.updateMe)

// Изменение пароля
router.route('/myPassword')
    .patch(authController.protect, userController.updateMyPassword)

// Удаление пользователя
router.route('/me')
    .delete(authController.protect, userController.deleteMe)


module.exports = router