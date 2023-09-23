import request from '@/utils/request'

export const reqComprehensive = (page, limit, sort, keyWords) =>
  request({ url: '/search/comprehensive', params: { page, limit, sort, keyWords } })
export const reqArticleList = (page, limit, sort, keyWords) =>
  request({ url: '/search/article', params: { page, limit, sort, keyWords } })
export const reqUserList = (page, limit, keyWords) =>
  request({ url: 'search/user', params: { page, limit, keyWords } })
  export const reqTagArticle= (page, limit,sort, tagId) =>
  request({ url: 'search/tag_article', params: { page, limit,sort, tagId } })