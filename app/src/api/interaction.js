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
export const reqIsStar = (articleId, userId) =>
  request({
    url: 'interaction/is_star',
    params: { articleId, userId }
  })
export const reqAddStar = (articleId, userId) =>
  request({
    url: 'interaction/add_star',
    params: { articleId, userId }
  })
export const reqDeleteStar = (articleId, userId) =>
  request({
    url: 'interaction/delete_star',
    params: { articleId, userId }
  })
export const reqIsFollow = (userId, followedUserId) =>
  request({
    url: 'interaction/is_follow',
    params: { userId, followedUserId }
  })
export const reqAddFollow = (userId, followedUserId) =>
  request({
    url: 'interaction/add_follow',
    params: { userId, followedUserId }
  })
export const reqDeleteFollow = (userId, followedUserId) =>
  request({
    url: 'interaction/delete_follow',
    params: { userId, followedUserId }
  })
