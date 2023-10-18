import request from '@/utils/request'

export const getArticleType = () =>
  request({
    url: 'article/type'
  })
export const getTag = () =>
  request({
    url: 'article/tag'
  })

export const getArticle = (page, limit, type, recommendType) =>
  request({
    url: 'article/recommend',
    params: { page, limit, type, recommendType }
  })

export const getArticleTags = (id) =>
  request({
    url: 'article/tags',
    params: { id }
  })

export const getArticleDetail = (id) =>
  request({
    url: 'article/article_detail',
    params: { id }
  })

