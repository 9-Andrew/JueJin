<script setup>
import { reactive } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import useSettingsStore from '@/store/settings.js';

const locale = zhCn
const config = reactive({
  max: 1
})
const settingsStore = useSettingsStore()
if (settingsStore.isDark == 2) {
  settingsStore.followSystem(settingsStore.isDark)
} else {
  settingsStore.setDark(settingsStore.isDark)
}
</script>

<template>
  <el-config-provider :locale="locale" :message="config"><router-view></router-view></el-config-provider>
</template>
