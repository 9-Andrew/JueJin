const express = require('express')
const router = express.Router()

let userinfoHandler = require('../routes_handler/userinfo')

// 获取当前用户基本信息的路由
router.get('/userinfo', userinfoHandler.getUserInfo)

module.exports = router
