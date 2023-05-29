let express = require('express')
let router = express.Router()
let articleHandler=require('../routes_handler/article')

router.get('/type',articleHandler.getArticleType)
router.get('/recommend',articleHandler.getArticle)
router.get('/tags',articleHandler.getArticleTags)

module.exports=router