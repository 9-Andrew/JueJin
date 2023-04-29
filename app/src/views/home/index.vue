<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="getUI">
    <el-tab-pane label="推荐" name="recommend"></el-tab-pane>
    <el-tab-pane label="最新" name="news"></el-tab-pane>
    <ArticleList></ArticleList>
  </el-tabs>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ArticleList from './ArticleList.vue'
import { getArticle } from '@/api/article.js'
import {getUserInfo} from '@/api/userinfo';

const activeName = ref('recommend')

const handleClick = async () => {
  let route = useRoute()
  let result = await getArticle()
  console.log(result)
}

const getUI=async ()=>{
  let result = await getUserInfo()
  console.log(result)
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
  .el-tabs__content {
    padding: 12px 30px 0;
  }
}
</style>
