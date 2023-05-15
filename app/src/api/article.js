import request from '@/utils/request'

export const getArticleType = () =>
  request({
    url: 'article/type'
  })

export const getArticle = (page,limit,type) =>
  request({
    url: 'article/recommend',
    params:{page,limit,type}
  })
