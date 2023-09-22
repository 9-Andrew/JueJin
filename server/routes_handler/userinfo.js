const db = require('../db/index')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  const sql = `select id,username, nickname, email, avatar from user where username=? or nickname=?`
  db.query(sql, [req.auth.username,req.auth.username], (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取用户信息失败！')
    res.send({
      status: 0,
      message: '获取用户信息成功！',
      data: results[0],
    })
  })
}
