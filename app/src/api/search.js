import request from '@/utils/request'

export const reqComprehensive = (page, limit, sort, keyWords) =>
  request({ url: '/search/comprehensive', params: { page, limit, sort, keyWords } })
export const reqArticleList = (page, limit, sort, keyWords) =>
  request({ url: '/search/article', params: { page, limit, sort, keyWords } })
export const reqUserList = (page, limit, keyWords) =>
  request({ url: 'search/user', params: { page, limit, keyWords } })
  export const reqArticleByTagId= (page, limit,sort, tagId) =>
  request({ url: 'search/article_byTagId', params: { page, limit,sort, tagId } })
  export const reqArticleByUserIdList = (userIdList,page,limit) =>
  request({ url: 'search/article_byUserIdList', params: { userIdList,page,limit} })