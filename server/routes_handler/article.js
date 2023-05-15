const db = require('../db')
exports.getArticleType = (req, res) => {
  const sql = `select * from article_type`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('获取文章分类失败！')
    res.send({
      status: 0,
      message: '获取文章分类成功！',
      data: results
    })
  })
}

exports.getArticle = (req, res) => {
  let { page, limit, type } = req.query

  let sql = `select article.id,user.nickname,user.username,title,content,cover,name as 'article_type',view_num,like_num,like_num,article.create_time from article
  inner join article_type on article.type_id=article_type.id
  inner join user on article.user_id=user.id `
  type && (sql += `where path='${type}' `)
  sql += `limit ${(page - 1) * limit},${limit};`

  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('没有更多了！',2)
    res.send({
      status: 0,
      message: '获取文章成功！',
      data: results
    })
  })
}
