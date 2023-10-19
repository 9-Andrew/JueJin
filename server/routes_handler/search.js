const db = require('../db')
let total = 0

exports.getComprehensive = (req, res) => {
  let { page, limit, sort, keyWords } = req.query
  keyWords && (keyWords = keyWords.replace(/'/g, ''))

  let sql = `select article.id,user.nickname,user.username,title,content,cover,name AS 'article_type',view_num,like_num,article.create_time,user.id AS user_id from article
  inner join article_type on article.type_id=article_type.id
  inner join user on article.user_id=user.id\n
  where status=1 `
  keyWords &&
    (sql += `and title like '%${keyWords}%' or content like '%${keyWords}%'\n`)

  db.query(sql, (_err, results) => (total = results.length))

  switch (sort) {
    case '0':
      sql += 'ORDER BY view_num DESC,like_num DESC'
      break
    case '1':
      sql += 'ORDER BY article.create_time DESC'
      break
    case '2':
      sql += 'ORDER BY like_num DESC,view_num DESC'
      break
  }
  sql += `\nlimit ${(page - 1) * limit},${limit};`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取文章成功！',
      data: results,
      total
    })
  })
}
exports.getArticleList = (req, res) => {
  let { page, limit, sort, keyWords } = req.query
  keyWords && (keyWords = keyWords.replace(/'/g, ''))

  let sql = `select article.id,user.nickname,user.username,title,content,cover,name AS 'article_type',view_num,like_num,article.create_time,user.id AS user_id from article
  inner join article_type on article.type_id=article_type.id
  inner join user on article.user_id=user.id\n
  where status=1 `

  keyWords &&
    (sql += `and title like '%${keyWords}%' or content like '%${keyWords}%'\n`)

  db.query(sql, (_err, results) => (total = results.length))

  switch (sort) {
    case '0':
      sql += 'ORDER BY view_num DESC,like_num DESC'
      break
    case '1':
      sql += 'ORDER BY article.create_time DESC'
      break
    case '2':
      sql += 'ORDER BY like_num DESC,view_num DESC'
      break
  }
  sql += `\nlimit ${(page - 1) * limit},${limit}`
  let randomSortSql = `SELECT * FROM (${sql}) AS sorted_data ORDER BY RAND();`
  db.query(randomSortSql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取文章成功！',
      data: results,
      total
    })
  })
}
exports.getUserList = (req, res) => {
  let { page, limit, keyWords, userIdList } = req.query
  keyWords && (keyWords = keyWords.replace(/'/g, ''))
  let sql = `SELECT id,username,nickname,avatar FROM user WHERE `
  if (keyWords) {
    sql += `(nickname is null and username like '%${keyWords}%')or(nickname LIKE '%${keyWords}%')`
  } else {
    sql += `id in (${userIdList ? userIdList.join() : '-1'})`
  }

  db.query(sql, (_err, results) => (total = results.length))

  sql += `ORDER BY create_time ASC\nlimit ${(page - 1) * limit},${limit};`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取用户列表成功！',
      data: results,
      total
    })
  })
}

exports.getArticleByTagId = (req, res) => {
  let { page, limit, sort, tagId } = req.query

  let sql = `SELECT
    article.id,
    USER.nickname,
    USER.username,
    title,
    content,
    cover,
    NAME AS 'article_type',
    view_num,
    like_num,
    article.create_time,
    USER.id AS user_id
  FROM
    article_tag_merge
    INNER JOIN article ON article_tag_merge.article_id = article.id 
    INNER JOIN article_type ON article.type_id = article_type.id
    INNER JOIN USER ON article.user_id = USER.id 
  WHERE tag_id = '${tagId}' AND article.status=1 `

  db.query(sql, (_err, results) => (total = results.length))
  let tagName = ''
  let sql2 = `select tag_name from tag where id=${tagId}`
  db.query(sql2, (_err, results) => (tagName = results.length == 1 ? results[0].tag_name : null))

  switch (sort) {
    case '0':
      sql += 'ORDER BY view_num DESC,like_num DESC'
      break
    case '1':
      sql += 'ORDER BY article.create_time DESC'
      break
    case '2':
      sql += 'ORDER BY like_num DESC,view_num DESC'
      break
  }
  sql += `\nlimit ${(page - 1) * limit},${limit};`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: total == 0 ? '标签不存在' : '获取标签文章成功！',
      data: results,
      total,
      tagName
    })
  })
}
exports.getArticleByUserIdList = (req, res) => {
  let { page, limit, userIdList } = req.query

  let sql = `select article.id,user.nickname,user.username,title,content,cover,view_num,like_num,article.create_time,user.id AS user_id from article
  inner join user on article.user_id=user.id
  where status=1 and user_id in (${userIdList ? userIdList.join() : '-1'}) ORDER BY article.create_time DESC\n`

  page && (sql += `limit ${(page - 1) * limit},${limit}`)
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('没有更多了！', 0)
    res.send({
      status: 0,
      message: '获取文章成功！',
      data: results
    })
  })
}
exports.getArticleByUserId = (req, res) => {
  // type: 0为草稿，1为已发布的文章
  let { page, limit, userId, type } = req.query

  let sql = `
  SELECT
    article.id,
    USER.nickname,
    USER.username,
    title,
    content,
    cover,
    NAME AS 'article_type',
    view_num,
    like_num,
    article.create_time,
    USER.id AS user_id 
  FROM
    article
    INNER JOIN article_type ON article.type_id = article_type.id
    INNER JOIN USER ON article.user_id = USER.id 
  WHERE
    STATUS =${type} and user_id=${userId} `

  page && (sql += `limit ${(page - 1) * limit},${limit}`)
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('没有更多了！', 0)
    res.send({
      status: 0,
      message: `获取${type == 0 ? '草稿' : '文章'}成功！`,
      data: results
    })
  })
}
exports.getStarredArticleByUserId = (req, res) => {
  let { page, limit, userId } = req.query

  let sql = `SELECT
      article.id,
      USER.nickname,
      USER.username,
      title,
      content,
      cover,
      NAME AS 'article_type',
      view_num,
      like_num,
      article.create_time,
      USER.id AS user_id 
    FROM
      article
      INNER JOIN article_type ON article.type_id = article_type.id
      INNER JOIN USER ON article.user_id = USER.id 
    WHERE
      STATUS =1 and article.id in(select article_id from star WHERE user_id=${userId}) `
  db.query(sql, (_err, results) => (total = results.length))

  page && (sql += `limit ${(page - 1) * limit},${limit}`)
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('没有更多了！', 0)
    res.send({
      status: 0,
      message: '获取收藏文章成功！',
      data: results,
      total
    })
  })
}
exports.getLikedArticleByUserId = (req, res) => {
  let { page, limit, userId } = req.query

  let sql = `SELECT
      article.id,
      USER.nickname,
      USER.username,
      title,
      content,
      cover,
      NAME AS 'article_type',
      view_num,
      like_num,
      article.create_time,
      USER.id AS user_id 
    FROM
      article
      INNER JOIN article_type ON article.type_id = article_type.id
      INNER JOIN USER ON article.user_id = USER.id 
    WHERE
      STATUS =1 and article.id in(select content_id from \`like\`  WHERE type_id=0 and user_id=${userId}) `

  page && (sql += `limit ${(page - 1) * limit},${limit}`)
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('没有更多了！', 0)
    res.send({
      status: 0,
      message: '获取点赞文章成功！',
      data: results
    })
  })
}
exports.getArticleByKeyWordsFromPublishedAndStarredAndLiked = (req, res) => {
  let { page, limit, userId, keyWords } = req.query
  keyWords && (keyWords = keyWords.replace(/'/g, ''))

  let sql = `SELECT
            article.id,
            USER.nickname,
            USER.username,
            title,
            content,
            cover,
            NAME AS 'article_type',
            view_num,
            like_num,
            article.create_time,
            USER.id AS user_id 
          FROM
            article
            INNER JOIN article_type ON article.type_id = article_type.id
            INNER JOIN USER ON article.user_id = USER.id 
          WHERE
            STATUS = 1 
            AND (user_id = ${userId}
                OR article.id IN (SELECT content_id FROM \`like\` WHERE type_id = 0 AND user_id = ${userId}) 
                OR article.id IN (SELECT article_id  FROM \`star\` WHERE user_id = ${userId})) `
  keyWords &&
    (sql += `AND (title like '%${keyWords}%' or content like '%${keyWords}%')`)

  sql += `\nlimit ${(page - 1) * limit},${limit};`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取文章成功！',
      data: results
    })
  })
}