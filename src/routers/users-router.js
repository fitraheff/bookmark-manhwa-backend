const express = require('express')
const router = express.Router()
const userController = require('../controllers/users-controller')
const {authMiddleware, authAdminMiddleware} = require('../middleware/auth-middleware')

router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)

router.use(authMiddleware)

router.get('/:id', userController.getUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

router.use(authAdminMiddleware)
router.get('/', userController.getAllUsers)

module.exports = router