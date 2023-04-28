let express = require('express')
let router = express.Router()
let articleHandler=require('../routes_handler/article')

router.get('/type',articleHandler.getArticleType)
router.get('/recommend',articleHandler.getArticle)

module.exports=router