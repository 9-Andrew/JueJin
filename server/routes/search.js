let express = require('express')
let router = express.Router()
let searchHandler = require('../routes_handler/search')

router.get('/comprehensive', searchHandler.getComprehensive)
router.get('/article', searchHandler.getArticleList)
router.get('/user', searchHandler.getUserList)

module.exports = router
