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
  let { typeId, userId, contentId } = req.query
  const sql =
    'select * from `like` WHERE type_id=' + typeId + ' and user_id=' +
    userId +
    ' and content_id=' +
    contentId
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      data: results.length > 0
    })
  })
}
exports.getAddLike = (req, res) => {
  let { typeId, userId, contentId } = req.query
  const sql =
    'insert into `like` (user_id,content_id,type_id) value(' +
    userId +
    ',' +
    contentId +
    ',' + typeId + ')'
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('添加点赞失败！', 0)
    if (typeId == 0) {
      const sql2 = 'update article set like_num=like_num+1 WHERE id =' + contentId
      db.query(sql2, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('添加点赞失败！', 0)
      })
    }
    res.send({
      status: 0,
      message: '添加点赞成功！'
    })
  })
}
exports.getDeleteLike = (req, res) => {
  let { typeId, userId, contentId } = req.query
  const sql =
    'delete from `like` where type_id=' + typeId + ' and user_id=' +
    userId +
    ' and content_id=' +
    contentId

  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('取消点赞失败！', 0)
    if (typeId == 0) {
      const sql2 = 'update article set like_num=like_num-1 WHERE id =' + contentId
      db.query(sql2, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('取消点赞失败！', 0)
      })
    }
    res.send({
      status: 0,
      message: '取消点赞成功！'
    })
  })
}
exports.getIsStar = (req, res) => {
  let { articleId, userId } = req.query
  const sql =
    'select * from star WHERE user_id=' +
    userId +
    ' and article_id=' +
    articleId
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      data: results.length > 0
    })
  })
}
exports.getAddStar = (req, res) => {
  let { articleId, userId } = req.query
  const sql =
    'insert into star (user_id,article_id) value(' +
    userId +
    ',' +
    articleId +
    ')'
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('收藏失败！', 0)
    const sql2 = 'update article set star_num=star_num+1 WHERE id =' + articleId
    db.query(sql2, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('添加点赞失败！', 0)
    })
    res.send({
      status: 0,
      message: '收藏成功！'
    })
  })
}
exports.getDeleteStar = (req, res) => {
  let { articleId, userId } = req.query
  const sql =
    'delete from star where user_id=' + userId + ' and article_id=' + articleId

  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('取消收藏失败！', 0)
    const sql2 = 'update article set star_num=star_num-1 WHERE id =' + articleId
    db.query(sql2, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('取消点赞失败！', 0)
    })
    res.send({
      status: 0,
      message: '取消收藏成功！'
    })
  })
}
exports.getIsFollow = (req, res) => {
  let { userId, followedUserId } = req.query
  const sql =
    'select * from follow WHERE user_id=' +
    userId +
    ' and followed_user_id=' +
    followedUserId

  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      data: results.length > 0
    })
  })
}
exports.getAddFollow = (req, res) => {
  let { userId, followedUserId } = req.query
  const sql =
    'insert into follow (user_id,followed_user_id) value(' +
    userId +
    ',' +
    followedUserId +
    ')'
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('关注失败！', 0)
    res.send({
      status: 0,
      message: '关注成功！'
    })
  })
}
exports.getDeleteFollow = (req, res) => {
  let { userId, followedUserId } = req.query
  const sql =
    'delete from follow where user_id=' +
    userId +
    ' and followed_user_id=' +
    followedUserId

  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('取消关注失败！', 0)
    res.send({
      status: 0,
      message: '取消关注成功！'
    })
  })
}

exports.getFollowListByUserId = (req, res) => {
  let { userId } = req.query
  const sql = 'select followed_user_id from follow WHERE user_id=' + userId

  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      data: results
    })
  })
}
exports.getFollowedListByUserId = (req, res) => {
  let { userId } = req.query
  const sql = 'select user_id from follow WHERE followed_user_id =' + userId

  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      data: results
    })
  })
}
