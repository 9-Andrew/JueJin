import request from '@/utils/request'

export const reqComprehensive = (page, limit, sort, keyWords) =>
  request({ url: '/search/comprehensive', params: { page, limit, sort, keyWords } })
export const reqArticleList = (page, limit, sort, keyWords) =>
  request({ url: '/search/article', params: { page, limit, sort, keyWords } })
export const reqUserList = (page, limit, keyWords) =>
  request({ url: 'search/user', params: { page, limit, keyWords } })
export const reqArticleByTagId = (page, limit, sort, tagId) =>
  request({ url: 'search/article_byTagId', params: { page, limit, sort, tagId } })
export const reqArticleByUserIdList = (userIdList, page, limit) =>
  request({ url: 'search/article_byUserIdList', params: { userIdList, page, limit } })

export const reqArticleByUserId = (page, limit, userId, type) =>
  request({ url: 'search/article_byUserId', params: { page, limit, userId, type } })
export const reqStarredArticleByUserId = (page, limit, userId) =>
  request({ url: 'search/starred_article_byUserId', params: { page, limit, userId } })
export const reqLikedArticleByUserId = (page, limit, userId) =>
  request({ url: 'search/liked_article_byUserId', params: { page, limit, userId } })
export const reqArticleByKeyWordsFromPublishedAndStarredAndLiked = (page, limit, userId, keyWords) =>
  request({ url: 'search/article_byKeyWords_fromPSL', params: { page, limit, userId, keyWords } })
export const reqUserListByUserIdList = (page, limit, userIdList) =>
  request({ url: 'search/user', params: { page, limit, userIdList } })