import { defineStore } from 'pinia'
import { reqComprehensive, reqArticleList, reqUserList } from '@/api/search.js'
import { useRoute } from 'vue-router'
import { nextTick } from 'vue'

const useSearchStore = defineStore('search', {
  state() {
    return {
      pageNo: 1,
      categoryParams: 0,
      sortParams: 0,
      keyWords: useRoute().query.keyWords,
      resultList: [],
      total: 0,
      loading: true,
      searchHistory: JSON.parse(localStorage.getItem('searchHistory')) || []
    }
  },
  actions: {
    async getData(pageNo = 1, limit = 20) {
      nextTick(() => {
        document.title = this.keyWords + ' - 搜索 - ' + import.meta.env.VITE_APP_TITLE
      })
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
      if (!this.searchHistory.find((item) => item == this.keyWords) && this.keyWords != '') {
        this.searchHistory.unshift(this.keyWords)
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))
      }
    },
    setCategoryParams(value) {
      this.categoryParams = value
      this.pageNo = 1
      this.getData()
    },
    setSortParams(value) {
      this.sortParams = value
      this.pageNo = 1
      this.getData()
    }
  }
})

export default useSearchStore
