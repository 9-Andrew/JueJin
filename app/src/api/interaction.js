import request from '@/utils/request'

export const reqAddView = (id) =>
  request({
    url: 'interaction/add_view',
    params: { id }
  })
export const reqIsLike = (articleId, userId) =>
  request({
    url: 'interaction/is_like',
    params: { articleId, userId }
  })
export const reqAddLike = (articleId, userId) =>
  request({
    url: 'interaction/add_like',
    params: { articleId, userId }
  })
export const reqDeleteLike = (articleId, userId) =>
  request({
    url: 'interaction/delete_like',
    params: { articleId, userId }
  })
