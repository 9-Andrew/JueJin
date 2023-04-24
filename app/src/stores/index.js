import { defineStore } from 'pinia'
export const useUserInfo = defineStore('user', {
  state() {
    return {
      userInfo: {}
    }
  },
  actions: {
    setUserInfo(user) {
      this.userInfo = user
    }
  },
  getters: {
    getUserInfo(){
      return this.userInfo
    }
  }
})
