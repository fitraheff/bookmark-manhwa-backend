const express = require('express')
const router = express.Router()
const bookmarkController = require('../controllers/bookmark-controller')
const {authMiddleware } = require('../middleware/auth-middleware')

router.use(authMiddleware)

router.post('/', bookmarkController.addBookmark)
router.get('/', bookmarkController.getBookmarks)
// router.get('/s', bookmarkController.getManhwa)
router.put('/:id', bookmarkController.updateBookmark)
router.delete('/:id', bookmarkController.deleteBookmark)

module.exports = router