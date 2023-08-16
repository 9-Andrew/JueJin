import { defineStore } from 'pinia'

const useUserInfoStore = defineStore('user', {
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
export default useUserInfoStore