const db = require('../db/index')
const config = require('../config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
let axios = require('axios')

exports.login = (req, res) => {
  const userInfo = req.body
  const sql = 'select * from user where username=?'
  db.query(sql, userInfo.username, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) {
      return res.cc('用户不存在')
    }
    if (!bcrypt.compareSync(userInfo.password, results[0].password)) {
      return res.cc('用户名或密码不正确')
    }
    res.send({
      message: '登陆成功！',
      status: 0,
      token:
        'Bearer ' +
        jwt.sign({ username: userInfo.username }, config.jwtSecretKey, {
          expiresIn: config.expiresIn
        })
    })
  })
}

exports.register = (req, res) => {
  const userInfo = req.body
  const sql = 'select * from user where username=?'
  db.query(sql, userInfo.username, (err, results) => {
    if (err) return res.cc(err)
    if (results.length > 0) {
      return res.cc('用户名已被占用')
    }
    const sql = 'insert into user set ?'
    userInfo.password = bcrypt.hashSync(userInfo.password, 10)
    db.query(sql, userInfo, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) {
        return res.cc('注册失败,请联系管理员')
      }
      res.cc('注册成功！', 0)
    })
  })
}

exports.githubOAuth = async (req, res) => {
  try {
    let { code } = req.query
    if (!code) {
      res.cc('code 缺失')
      return
    }
    const body = {
      client_id: '3c8ad4de2df49076331b', // 必须
      client_secret: '704ee0107f03e3d3d0a7c9ad263356d6946c16f2', // 必须
      code: code // 必须,这个不用我们填写，当授权跳转后，会在/oauth-callback 自动添加code
    }
    const opts = { headers: { accept: 'application/json' } }
    const response = await axios.post(
      `https://github.com/login/oauth/access_token`,
      body,
      opts
    )

    const token = await response.data['access_token']
    const userinfo = await axios.get(`https://api.github.com/user`, {
      headers: {
        // 在请求头中添加 Authorization 字段
        Authorization: `token ${token}`
      }
    })


    let {
      id,
      login: nickname,
      avatar_url: avatar,
      login: username
    } = userinfo.data
    let user = { id, nickname, avatar }
    if (user.id) {
      //验证用户是否已经在数据库中
      const sql = 'select * from user where id=?'
      db.query(sql, user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) {
          const sql2 = 'insert into user set ?'
          db.query(sql2, user, (err) => {
            if (err) return res.cc(err)
          })
        }
        let token =
          'Bearer ' +
          jwt.sign({ username }, config.jwtSecretKey, {
            expiresIn: config.expiresIn
          })
        res.redirect(`http://localhost:5172/?token=${token}`)
      })
    } else {
      res.cc('授权登录失败')
    }
  } catch (error) {
    res.cc('e ' + error)
  }
}

exports.getUserInfo = (req, res) => {
  const { id } = req.query
  const sql = 'select * from user where id=?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('用户不存在！', 0)
    res.send({
      status: 0,
      message: '获取用户信息成功！',
      data: results[0]
    })
  })
}