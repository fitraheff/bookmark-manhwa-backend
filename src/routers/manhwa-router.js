const express = require('express')
const router = express.Router()
const manhwaController = require('../controllers/manhwa-controller')
const {authMiddleware, authAdminMiddleware} = require('../middleware/auth-middleware')

router.get('/', manhwaController.getAllManhwa)
router.get('/s', manhwaController.getManhwa)

router.use(authMiddleware)

router.use(authAdminMiddleware)
router.post('/', manhwaController.addManhwa)
router.put('/:id', manhwaController.updateManhwa)
router.delete('/:id', manhwaController.deleteManhwa)

module.exports = router