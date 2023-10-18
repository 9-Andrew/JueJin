<template>
  <div class="container">
    <div class="content">
      <el-tabs v-model="activeName" class="demo-tabs" v-if="route.params.type != 'follow'">
        <el-tab-pane label="推荐" name="recommend"></el-tab-pane>
        <el-tab-pane label="最新" name="news"></el-tab-pane>
      </el-tabs>
      <el-skeleton :rows="8" :loading="loading" animated />
      <el-empty v-if="route.params.type == 'follow' && articleList.length == 0 && !loading"
        description="暂无关注人发布的文章"></el-empty>
      <ArticleItem v-for="al in articleList" :key="al.id" :article="al"></ArticleItem>
    </div>
    <div class="sidebar">
      <div class="advertise" :class="{ fixed: isFix }">
        <a class="tbaru" href="javascript:void(0)">我的广告位，便宜又大碗</a>
        <a class="tbaru" href="javascript:void(0)">我的广告位，便宜又大碗</a>
      </div>
      <div class="copyright">
        <ul>
          <li><a href="javascript:void(0)">用户协议</a></li>
          <li><a href="javascript:void(0)">营业执照</a></li>
          <li><a href="javascript:void(0)">隐私政策</a></li>
          <li><a href="javascript:void(0)">关于我们</a></li>
        </ul>
        <ul>
          <li><a href="javascript:void(0)">站点地图</a></li>
          <li><a href="javascript:void(0)">使用指南</a></li>
          <li><a href="javascript:void(0)">友情链接</a></li>
          <li><a href="javascript:void(0)">关于文章</a></li>
        </ul>
        <ul>
          <li><a href="javascript:void(0)">京ICP备xxx号</a></li>
          <li><a href="javascript:void(0)">&copy;2023 {{ TITLE }}</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, onBeforeUnmount, getCurrentInstance, watch, computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleItem from '@/components/ArticleItem/index.vue'
import { getArticle } from '@/api/article.js'
import { reqFollowNum } from '@/api/interaction.js';
import { reqArticleByUserIdList } from '@/api/search.js'
import useUserStore from '@/store/user.js';

let page = 1
let limit = 10
const activeName = ref('recommend')
const loading = ref(true)
const { proxy } = getCurrentInstance()
let articleList = reactive([])
let route = useRoute()
let router = useRouter()
let isFix = ref(false)
let loginDialogVisible = inject('loginDialogVisible')
let store = useUserStore()
let TITLE = computed(() => {
  return import.meta.env.VITE_APP_TITLE
})

const initList = async (isPush) => {
  isPush || ((loading.value = true) && (articleList.length = 0))
  let result = await getArticle(
    page,
    limit,
    route.params.type,
    activeName.value === 'recommend' ? 0 : 1
  )
  if (!isPush && !result.data) {
    router.push('/404')
    return
  }
  setTimeout(() => {
    articleList.push(...result.data)
    loading.value = false
  }, 400)
}
const initCategoryList = async () => {
  if (!store.userInfo.id) {
    articleList.length = 0
    return
  }
  let followResult = await reqFollowNum(store.userInfo.id)
  if (followResult.data.length == 0) {
    loading.value = false
    return
  }
  let articleResult = await reqArticleByUserIdList(followResult.data.map(i => i.followed_user_id), page, limit)
  setTimeout(() => {
    articleList.push(...articleResult.data)
    loading.value = false
  }, 400)
}
let loadingMore = proxy.$throttle(() => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  let clientHeight = document.documentElement.clientHeight
  let scrollHeight = document.documentElement.scrollHeight
  if (scrollTop + clientHeight >= scrollHeight) {
    page++
    route.params.type != 'follow' ? initList(true) : initCategoryList()
  }
  isFix.value = scrollTop >= 500
}, 1000)
let reload = () => {
  if (route.params.type != 'follow') {
    page = 1
    initList()
  } else {
    articleList.length = 0
    if (store.userInfo.id) {
      loading.value = true
      initCategoryList()
    } else {
      loginDialogVisible.value = true
    }
  }
}
watch([() => route.params, activeName], reload)
watch(() => store.userInfo.id, () => {
  if (route.params.type == 'follow') {
    initCategoryList()
  }
})
onMounted(() => {
  window.addEventListener('scroll', loadingMore, { passive: true })
  reload()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', loadingMore)
})
</script>

<style lang="less" scoped>
.container {
  width: 1300px;
  display: flex;
  margin: 0 auto;
  justify-content: space-around;

  .content {
    width: 1000px;
    margin-bottom: 15px;

    :deep(.demo-tabs) {
      width: 100%;
      background: var(--background-color);
      border-radius: var(--box-radius);

      .el-tabs__header {
        margin: 0;

        .el-tabs__nav-wrap {
          padding: 6px 19px 0;

          .el-tabs__nav>.el-tabs__item {
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
    }
  }

  .sidebar {
    width: 250px;

    .advertise {
      transition: top .4s;
      top: 0;

      a.tbaru {
        margin-bottom: 18px;
        width: 250px;
        border: 2px dashed #aaa;
        padding: 40px 15px;
        font-size: 14px;
        background-color: var(--background-color);
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

      @media (max-width: 1300px) {
        a.tbaru {
          font-size: 12px;
          padding: 25px 15px;
        }
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
    }

    .fixed {
      position: fixed;
      top: 70px;
    }
  }
}

.el-empty {
  background-color: #fff;
  height: 90vh;
}
</style>
