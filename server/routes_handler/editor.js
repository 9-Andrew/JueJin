const db = require('../db')
exports.getCreateArticle = (req, res) => {
  let { userId } = req.query

  let sql = `INSERT INTO article (user_id) VALUE(${userId})`

  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('文章创建失败！', 0)
    res.send({
      status: 0,
      message: '文章创建成功！',
      data: results.insertId
    })
  })
}

exports.getUpdateArticle = (req, res) => {
  let { title, content, cover, typeId, tagList, id, userId } = req.body

  const sql = `select * from article where id=${id} and user_id=${userId}`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('没有权限修改该文章！')

    const currentTime = new Date()
    const formattedTime = currentTime.toLocaleString().replace('/', '-')
    let sql1 = `UPDATE article SET title=?,content=?,type_id=?
    ${cover ? `,cover='${cover}'` : ''},create_time=? WHERE id=?`

    db.query(
      sql1,
      [title, content, typeId || 1, formattedTime, id],
      (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('文章更新失败！', 0)
      }
    )

    if (tagList.length > 0) {
      let sql2 = `DELETE FROM article_tag_merge WHERE article_id=${id}`
      let sql3 = `INSERT INTO article_tag_merge VALUES`
      tagList.forEach((item, index, arr) => {
        sql3 += `(${id},${item})`
        index == arr.length - 1 || (sql3 += ',')
      })
      db.query(sql2, (err) => {
        if (err) return res.cc(err)
        db.query(sql3, (err) => {
          if (err) return res.cc(err)
        })
      })
    }

    res.send({
      status: 0,
      message: '文章更新成功！'
    })
  })
}

exports.getPublishArticle = (req, res) => {
  let { title, content, cover, typeId, tagList, id, userId } = req.body

  const sql = `select * from article where id=${id} and user_id=${userId}`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('没有权限修改该文章！')

    const currentTime = new Date()
    const formattedTime = currentTime.toLocaleString().replace('/', '-')
    let sql1 = `UPDATE article SET title=?,content=?,type_id=?
      ${cover ? `,cover='${cover}'` : ''},create_time=?,status='1' WHERE id=?`

    db.query(
      sql1,
      [title, content, typeId || 1, formattedTime, id],
      (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('文章发布失败！', 0)
      }
    )

    let sql2 = `DELETE FROM article_tag_merge WHERE article_id=${id}`
    let sql3 = `INSERT INTO article_tag_merge VALUES`
    tagList.forEach((item, index, arr) => {
      sql3 += `(${id},${item})`
      index == arr.length - 1 || (sql3 += ',')
    })
    db.query(sql2, (err) => {
      if (err) return res.cc(err)
      db.query(sql3, (err) => {
        if (err) return res.cc(err)
      })
    })

    res.send({
      status: 0,
      message: '文章发布成功！'
    })
  })
}
