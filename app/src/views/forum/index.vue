<template>
  <div class="container">
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
    <div class="sidebar">
      <a class="tbaru" href="javascript:void();">我的广告位，便宜又大碗</a>
      <a class="tbaru" href="javascript:void();">我的广告位，便宜又大碗</a>
      <div class="copyright">
        <ul>
          <li><a href="javascript:void();">用户协议</a></li>
          <li><a href="javascript:void();">营业执照</a></li>
          <li><a href="javascript:void();">隐私政策</a></li>
          <li><a href="javascript:void();">关于我们</a></li>
        </ul>
        <ul>
          <li><a href="javascript:void();">站点地图</a></li>
          <li><a href="javascript:void();">使用指南</a></li>
          <li><a href="javascript:void();">友情链接</a></li>
          <li><a href="javascript:void();">关于文章</a></li>
        </ul>
        <ul>
          <li><a href="javascript:void();">京ICP备xxx号</a></li>
          <li><a href="javascript:void();">&copy;2023 觉金</a></li>
        </ul>
        <div class="pop" v-if="showPop">
          <a class="tbaru" href="javascript:void();">我的广告位，便宜又大碗</a>
          <a class="tbaru" href="javascript:void();">我的广告位，便宜又大碗</a>
        </div>
      </div>
    </div>
  </div>
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
let showPop = ref(false)

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
  showPop.value = scrollTop >= 400
})
watch(
  () => route.params,
  async () => {
    if (route.params.type != 'follow') {
      loading.value = true
      articleList.length = 0
      page = 1
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
.container {
  width: 1300px;
  display: flex;
  margin: 0 auto;
  justify-content: space-around;
  .demo-tabs {
    width: 1000px;
    background: #fff;
    margin-top: 15px;
    border-radius: 6px;
    .el-tabs__nav-wrap {
      padding: 12px 19px 0;
      .el-tabs__nav > .el-tabs__item {
        font-size: 16px;
        padding: 0 20px;
        &.is-active {
          color: var(--theme-color) !important;
        }
      }
      .el-tabs__active-bar {
        background: var(--theme-color);
      }
    }
  }
  .sidebar {
    margin-top: 15px;
    width: 250px;
    a.tbaru {
      margin-bottom: 18px;
      width: 250px;
      border: 2px dashed #aaa;
      padding: 40px 15px;
      font-size: 14px;
      background-color: #fff;
      display: block;
      text-decoration: none;
      color: #888;
      font-weight: bold;
      text-align: center;
    }
    a.tbaru:hover {
      border-color: #666;
      color: #444;
    }
    @media (max-width: 640px) {
      a.tbaru {
        font-size: 12px;
        padding: 25px 15px;
      }
    }
    .copyright {
      ul {
        display: flex;
        justify-content: space-around;
        padding: 0;
        a {
          font-size: 12px;
          color: #8a919f;
        }
      }
      .pop {
        position: fixed;
        top: 70px;
      }
    }
  }
}
</style>
