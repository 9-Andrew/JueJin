const db = require('../db/index')
const config = require('../config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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
        'Bear ' +
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
