<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="推荐" name="recommend"></el-tab-pane>
    <el-tab-pane label="最新" name="news"></el-tab-pane>
    <el-skeleton :rows="5" :loading="loading" animated />
    <ArticleList v-for="al in articleList" :key="al.id" :article="al" :moment="moment"></ArticleList>
  </el-tabs>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import ArticleList from './ArticleList.vue'
import { getArticle } from '@/api/article.js'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
moment.locale('zh-cn')

const activeName = ref('recommend')
const loading = ref(true)
let articleList = reactive({})

const handleClick = async () => {
  let route = useRoute()
  // loading.value=true
  let result = await getArticle()
  articleList = result.data
  loading.value = false
  console.log(articleList)
}

onMounted(() => {
  handleClick()
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
