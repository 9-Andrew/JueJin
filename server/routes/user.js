let express = require('express')
let router = express.Router()
let userHandler = require('../routes_handler/user')

router.post('/login', userHandler.login)
router.post('/register', userHandler.register)
router.get('/oauth-callback-github', userHandler.githubOAuth)
router.get('/user', userHandler.getUserInfo)

module.exports = router
