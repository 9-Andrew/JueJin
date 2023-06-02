let express = require('express')
let router = express.Router()
let articleHandler=require('../routes_handler/article')

router.get('/type',articleHandler.getArticleType)
router.get('/recommend',articleHandler.getArticleList)
router.get('/tags',articleHandler.getArticleTags)
router.get('/article_detail',articleHandler.getArticleDetail)

module.exports=router