import request from '@/utils/request'

export const getArticleType = () =>
  request({
    url: 'article/type'
  })

export const getArticle = () =>
  request({
    url: 'article/recommend'
  })
