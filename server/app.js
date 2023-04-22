let express = require('express')
let path = require('path')
let logger = require('morgan')
let cors = require('cors')
let joi = require('@hapi/joi') //数据检验
let bodyParser = require('body-parser') // 解析post请求体
let { expressjwt: jwt } = require('express-jwt')
const config = require('./config')

const app = express()
app.use((req, res, next) => {
  /**
   *
   * @param {*} err 响应数据，也可能是一个错误对象
   * @param {*} status 默认值为 1，表示失败
   */
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
// unless({ path: [/^\/api\//] }) 指定哪些接口无需访问权限
app.use(
  jwt({
    secret: config.jwtSecretKey,
    algorithms: ['HS256']
  }).unless({ path: [/^\/api\//] })
)

let userRouter = require('./routes/user')
app.use('/api', userRouter)

// error handler
app.use((err, req, res, next) => {
  // 身份认证失败后的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知的错误
  if(err) res.cc(err)
})

module.exports = app
