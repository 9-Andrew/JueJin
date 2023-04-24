let express = require('express')
let router = express.Router()
let userHandler=require('../routes_handler/user')


router.post('/login',userHandler.login )
router.post('/register',userHandler.register)

module.exports = router
