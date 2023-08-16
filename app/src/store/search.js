import { defineStore } from 'pinia'
import { reqComprehensive, reqArticleList, reqUserList } from '@/api/search.js'
import { useRoute } from 'vue-router'

const useSearchStore = defineStore('search', {
  state() {
    return {
      categoryParams: 0,
      sortParams: 0,
      keyWords: useRoute().query.keyWords,
      resultList: [],
      total: 0,
      loading: true
    }
  },
  actions: {
    async getData(pageNo = 1, limit = 20) {
      let result
      this.loading = true
      if (this.categoryParams == 0) {
        result = await reqComprehensive(pageNo, limit, this.sortParams, this.keyWords)
      } else if (this.categoryParams == 1) {
        result = await reqArticleList(pageNo, limit, this.sortParams, this.keyWords)
      } else {
        result = await reqUserList(pageNo, limit, this.keyWords)
      }
      setTimeout(() => {
        this.resultList = result.data
        this.total = result.total
        this.loading = false
      }, 400)
    },
    setCategoryParams(value){
      this.categoryParams=value
      this.getData()
    },
    setSortParams(value){
      this.sortParams=value
      this.getData()
    }
  }
})

export default useSearchStore
