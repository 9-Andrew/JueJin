<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="initList">
    <el-tab-pane label="推荐" name="recommend"></el-tab-pane>
    <el-tab-pane label="最新" name="news"></el-tab-pane>
    <el-skeleton :rows="5" :loading="loading" animated />
    <ArticleList
      v-for="al in articleList"
      :key="al.id"
      :article="al"
      :moment="moment"
    ></ArticleList>
  </el-tabs>
</template>

<script setup>
import { ref, onMounted, reactive, onBeforeUnmount, getCurrentInstance, watch } from 'vue'
import { useRoute } from 'vue-router'
import ArticleList from './ArticleList.vue'
import { getArticle } from '@/api/article.js'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
moment.locale('zh-cn')

let page = 1
let limit = 10
const activeName = ref('recommend')
const loading = ref(true)
const { proxy } = getCurrentInstance()
let articleList = reactive([])
let route = useRoute()

const initList = async () => {
  let result = await getArticle(page, limit, route.params.type)
  articleList.push(...result.data)
  console.log(result)
}
let loadingMore = proxy.$debounce(() => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  let clientHeight = document.documentElement.clientHeight
  let scrollHeight = document.documentElement.scrollHeight
  if (scrollTop + clientHeight >= scrollHeight) {
    page++
    initList()
  }
})
watch(
  () => route.params,
  async () => {
    if (route.params.type != 'follow') {
      loading.value = true
      articleList.length = 0
      page=1
      await initList()
      loading.value = false
    }
  }
)

onMounted(async () => {
  loading.value = true
  await initList()
  loading.value = false
  window.addEventListener('scroll', loadingMore)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', loadingMore)
})
</script>

<style lang="less">
.demo-tabs {
  background: #fff;
  margin-top: 15px;
  border-radius: 6px;
  .el-tabs__nav-wrap {
    padding: 12px 19px 0;
    .el-tabs__nav > .el-tabs__item {
      font-size: 16px;
      padding: 0 20px;
      &.is-active {
        color: #1e80ff !important;
      }
    }
    .el-tabs__active-bar {
      background: #1e80ff;
    }
  }
}
</style>
