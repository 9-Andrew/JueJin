let express = require('express')
let router = express.Router()
let searchHandler = require('../routes_handler/search')

router.get('/comprehensive', searchHandler.getComprehensive)
router.get('/article', searchHandler.getArticleList)
router.get('/user', searchHandler.getUserList)
router.get('/article_byTagId', searchHandler.getArticleByTagId)
router.get('/article_byUserIdList', searchHandler.getArticleByUserIdList)

router.get('/article_byUserId', searchHandler.getArticleByUserId)
router.get('/collected_article_byUserId', searchHandler.getCollectedArticleByUserId)
router.get('/starred_article_byUserId', searchHandler.getStarredArticleByUserId)
router.get('/article_byKeyWords_fromPSC', searchHandler.getArticleByKeyWordsFromPublishedAndStarredAndCollected)

module.exports = router
