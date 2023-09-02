import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/userinfo.js'

const useUserInfoStore = defineStore('user', {
  state() {
    return {
      userInfo: {}
    }
  },
  actions: {
    setUserInfo(user) {
      this.userInfo = user
    },
    async initUserInfo() {
      let { data } = await getUserInfo()
      this.setUserInfo(data)
    }
  },
  getters: {
    getUserInfo() {
      return this.userInfo
    }
  }
})
export default useUserInfoStore
