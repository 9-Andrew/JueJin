let express = require('express')
let path = require('path')
let logger = require('morgan')
let cors = require('cors')
let bodyParser = require('body-parser') // 解析 pos 请求体
let { expressjwt: jwt } = require('express-jwt')
const config = require('./config')
const upload = require('./uploadConfig')

const app = express()
app.disable('etag') // 禁用 ETag
app.use((_req, res, next) => {
  /**
   * @param {*} err 响应数据，也可能是一个错误对象
   * @param {*} status 默认值为 1，表示失败。0:成功，2:提示,401:jwt失效，
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
app.use('/public',express.static(path.join(__dirname, 'public/')))
app.use(
  jwt({
    secret: config.jwtSecretKey,
    algorithms: ['HS256']
  }).unless({ path: [/^\/api\//, /^\/article\//, /^\/search\//] })
)

let userRoute = require('./routes/user')
app.use('/api', userRoute)
let userinfoRoute = require('./routes/userinfo')
app.use('/my', userinfoRoute)
let articleRoute = require('./routes/article')
app.use('/article', articleRoute)
let searchRoute = require('./routes/search')
app.use('/search', searchRoute)
// 处理图片上传请求
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '没有上传文件！' })
  }
  const uploadedFilePath = req.file.path.replace(/\\/g, '/')
  // 可以在此处将上传成功的文件路径保存到数据库等
  res.json({ message: '上传成功', filePath: uploadedFilePath })
})

// 错误处理
app.use((err, _req, res, _next) => {
  // 身份认证失败后的错误
  if (err.name === 'UnauthorizedError')
    return res.cc('登录超时，请重新登录！', 401)
  // 未知的错误
  if (err) res.cc(err)
})

module.exports = app
