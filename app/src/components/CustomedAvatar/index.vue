<template>
  <el-avatar :src="imgUrl" :size="size" fit="fill"> {{ userInfo.nickname ||
    userInfo.username
  }}</el-avatar>
</template>

<script setup>
import { computed } from 'vue';
let props = defineProps({ userInfo: {}, size: { type: Number, default: 36 } })
const BASEURL = computed(() => import.meta.env.VITE_APP_BASEURL)
const imgUrl = computed(() => {
  if (props.userInfo.avatar) {
    return props.userInfo.avatar.indexOf('http') == 0 ? `${props.userInfo.avatar}` : `${BASEURL.value}/${props.userInfo.avatar}`
  }
  return ''
})
</script>

<style lang="less" scoped>
.el-avatar {
  cursor: pointer;
}
</style>