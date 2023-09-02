let express = require('express')
let router = express.Router()
let editorHandler = require('../routes_handler/editor')

router.get('/create', editorHandler.getCreateArticle)
router.post('/update', editorHandler.getUpdateArticle)
router.post('/publish', editorHandler.getPublishArticle)

module.exports = router
