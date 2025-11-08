const express = require('express')
const router = express.Router()
const manhwaController = require('../controllers/manhwa-controller')

router.get('/', manhwaController.getAllManhwa)
router.post('/', manhwaController.addManhwa)
router.get('/s', manhwaController.getManhwa)
router.put('/:id', manhwaController.updateManhwa)
router.delete('/:id', manhwaController.deleteManhwa)

module.exports = router