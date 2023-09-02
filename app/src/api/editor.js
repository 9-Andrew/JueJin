import request from '@/utils/request'

export const reqCreateArticle = (userId) => request({ url: 'editor/create', params: { userId } })
export const reqUpdateArticle = (articleParams) =>
  request({
    url: 'editor/update',
    method: 'post',
    data: articleParams
  })
export const reqPublishArticle = (articleParams) =>
  request({
    url: 'editor/publish',
    method: 'post',
    data: articleParams
  })
