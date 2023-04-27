import request from '@/utils/request'

export const getArticleType = () =>
  request({
    url: 'article/type'
  })
