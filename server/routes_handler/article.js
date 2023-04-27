const db=require('../db')

exports.getArticleType=(req,res)=>{
  const sql = `select * from article_type`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows===0) return res.cc('获取文章分类失败！')
    res.send({
      status: 0,
      message: '获取文章分类成功！',
      data: results,
    })
  })
}