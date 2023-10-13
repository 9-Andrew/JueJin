import { defineStore } from 'pinia'

const useSettingsStore = defineStore('settings', {
  state() {
    return {
      // 0为浅色模式，1为暗色模式，2为跟随系统
      isDark: parseInt(localStorage.getItem('isDark')) || 0
    }
  },
  actions: {
    setDark(value) {
      this.isDark = value
      localStorage.setItem('isDark', value)
      if (this.isDark == 0) {
        document.documentElement.classList.remove('dark')
      } else if (this.isDark == 1) {
        document.documentElement.classList.add('dark')
      } else {
        this.followSystem()
      }
    },
    followSystem() {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleThemeChange = (e) => {
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
      darkModeMediaQuery.addEventListener('change', handleThemeChange);

      // 初始检查系统的主题模式
      handleThemeChange(darkModeMediaQuery);

    }
  }
})
export default useSettingsStore
