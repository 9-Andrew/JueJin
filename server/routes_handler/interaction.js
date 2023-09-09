const db = require('../db')

exports.getAddView = (req, res) => {
  let { id } = req.query
  const sql = 'update article set view_num=view_num+1 where id =' + id
  db.query(sql, (err) => {
    if (err) return res.cc(err)
    res.cc('浏览量添加成功！', 0)
  })
}
exports.getIsLike = (req, res) => {
  let { articleId, userId } = req.query
  const sql =
    'select * from `like` WHERE type_id=1 and user_id=' +
    userId +
    ' and content_id=' +
    articleId
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      data: results.length > 0
    })
  })
}
exports.getAddLike = (req, res) => {
  let { articleId, userId } = req.query
  const sql =
    'insert into `like` (user_id,content_id,type_id) value(' +
    userId +
    ',' +
    articleId +
    ',1)'
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('添加点赞失败！', 0)
    const sql2 = 'update article set like_num=like_num+1 WHERE id =' + articleId
    db.query(sql2, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('添加点赞失败！', 0)
    })
    res.send({
      status: 0,
      message: '添加点赞成功！'
    })
  })
}
exports.getDeleteLike = (req, res) => {
  let { articleId, userId } = req.query
  const sql =
    'delete from `like` where type_id=1 and user_id=' +
    userId +
    ' and content_id=' +
    articleId
  console.log(sql)
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('取消点赞失败！', 0)
    const sql2 = 'update article set like_num=like_num-1 WHERE id =' + articleId
    db.query(sql2, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('取消点赞失败！', 0)
    })
    res.send({
      status: 0,
      message: '取消点赞成功！'
    })
  })
}
