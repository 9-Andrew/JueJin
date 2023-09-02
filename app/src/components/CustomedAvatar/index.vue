<template>
  <el-avatar :src="userInfo.avatar && `${BASEURL}/${userInfo.avatar}`" :size="36"> {{ userInfo.nickname ||
    userInfo.username
  }}</el-avatar>
</template>

<script setup>
import { computed } from 'vue';
defineProps(['userInfo'])
const BASEURL = computed(() => import.meta.env.VITE_APP_BASEURL)
</script>

<style lang="less" scoped>
.el-avatar {
  cursor: pointer;
}
</style>