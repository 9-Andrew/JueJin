let express = require('express')
let router = express.Router()
let userHandler=require('../router_handler/user')


router.get('/login',userHandler.login )

module.exports = router
