<template>
  <teleport v-if="isTeleportReady" to='header'>
    <div class="category_container">
      <ul class="category">
        <li v-for="(item, index) in category" :key="index" :class="{ checked: store.categoryParams == index }"
          @click="store.setCategoryParams(index)">{{ item }}</li>
      </ul>
    </div>
  </teleport>
  <div class="container">
    <ul class="sort" v-if="store.categoryParams != 2">
      <li v-for="(item, index) in sort" :key="index" :class="{ checked: store.sortParams == index }"
        @click="store.setSortParams(index)">
        <el-divider v-if="index != 0" direction="vertical"></el-divider>
        {{ item }}
      </li>
    </ul>
    <el-skeleton v-if="store.loading" :rows="5" :loading="store.loading" animated />
    <div class="content" v-else>
      <el-empty v-if="store.resultList.length == 0" description="暂无内容"></el-empty>
      <div v-else>
        <div class="article-container" v-if="store.categoryParams != 2">
          <ArticleItem v-for="rl in store.resultList" :key="rl.id" :article="rl" :keyWords="route.query.keyWords">
          </ArticleItem>
        </div>
        <div class="user-container" v-else>
          <div v-for="(rl, index) in store.resultList" :key="rl.id" @click="openUser(rl)" class="user_item">
            <CustomedAvatar :userInfo="rl" :size="60"></CustomedAvatar>
            <div class="author_info">
              <div class="author_name" v-html="highLight(rl)"></div>
              <div class="meta_info">
                {{ articleNumList[index] || 0 }} 文章<span>·</span>{{ followNumList[index] || 0 }} 个关注者
              </div>
            </div>
            <el-button type="success" :plain="!isFollowList[index]" @click.stop="followHandler(rl.id, index)">{{
              isFollowList[index] ? '已关注' :
              '关注'
            }}</el-button>
          </div>
        </div>
        <el-pagination v-model:current-page="store.pageNo" v-model:page-size="limit" background :page-sizes="[10, 20, 30]"
          layout=" prev, pager, next, jumper,->,sizes,total" :total="store.total"
          @current-change="store.getData(store.pageNo, limit)" @size-change="store.getData(store.pageNo, limit)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch, inject } from 'vue';
import useSearchStore from '@/store/search.js';
import useUserStore from '@/store/user.js';
import ArticleItem from '@/views/forum/ArticleItem/index.vue';
import { reqIsFollow, reqAddFollow, reqDeleteFollow, reqFollowNum, reqArticleNum } from '@/api/interaction.js';
import { useRouter, useRoute } from 'vue-router';

const category = ['综合', '文章', '用户']
const sort = ['综合排序', '最新优先', '最热优先']
const limit = ref(20)
const isTeleportReady = ref(false)
const store = useSearchStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const isFollowList = ref([])
const articleNumList = ref([])
const followNumList = ref([])
const loginDialogVisible = inject('loginDialogVisible')

const highLight = (user) => {
  let reg = new RegExp(store.keyWords, "gi")
  let u = user.nickname || user.username
  return u.replace(reg, `<span style='color:red;font-weight:bolder;'>${store.keyWords}</span>`)
}
let followHandler = async (userId, index) => {
  if (userStore.userInfo.id) {
    if (isFollowList.value[index]) {
      await reqDeleteFollow(userStore.userInfo.id, userId)
    } else {
      await reqAddFollow(userStore.userInfo.id, userId)
    }
    isFollowList.value[index] = !isFollowList.value[index]
  } else {
    loginDialogVisible.value = true
  }
}
const openUser = (rl) => {
  let url = router.resolve(`/user/${rl.id}`).href
  window.open(url, '_blank')
}
const isFollowHandler = () => {
  store.resultList.forEach(async (item, index) => {
    if (userStore.userInfo.id) {
      let followResult = await reqIsFollow(userStore.userInfo.id, item.id)
      isFollowList.value[index] = followResult.data
    } else {
      isFollowList.value.length = 0
    }
    let articleNumResult = await reqArticleNum([item.id])
    articleNumList.value[index] = articleNumResult.data.length
    let followNumResult = await reqFollowNum(item.id)
    followNumList.value[index] = followNumResult.data.length
  })
}

watch(() => store.categoryParams, (v) => {
  if (v == 2) {
    setTimeout(isFollowHandler, 800)
  }
})
watch(() => userStore.userInfo.id, isFollowHandler)
onMounted(async () => {
  await nextTick()
  isTeleportReady.value = true
  store.getData()
})
onBeforeUnmount(() => {
  store.$reset()
})
</script>

<style lang="less" scoped>
.category_container {
  position: fixed;
  left: 0;
  width: 100vw;
  height: 46px;
  background: linear-gradient(#f2f3f5, #fff 8%);
  line-height: 46px;

  .category {
    display: flex;
    width: 1000px;
    margin: 0 auto;

    li {
      cursor: pointer;
      padding: 0 20px;

      &:hover {
        color: var(--theme-color);
      }
    }
  }


}

.container {
  width: 1000px;
  margin: 0 auto;
  margin-top: 40px;
  background: #fff;

  .sort {
    display: flex;
    height: 54px;
    line-height: 54px;
    border-bottom: 1px solid #dcdfe6;

    li {
      cursor: pointer;

      &:nth-child(1) {
        padding-left: 18px;
      }

      &:hover {
        color: var(--theme-color);
      }

      .el-divider {
        height: 22px;
        margin: 0 18px;
      }
    }
  }

  .content {

    .el-pagination {
      padding: 18px 30px;
    }

    .user-container {
      .user_item {
        display: flex;
        align-items: center;
        padding: 16px 36px;
        border-bottom: 1px solid #f4f5f6;
        cursor: pointer;

        .author_info {
          margin-left: 34px;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          flex-grow: 1;

          .author_name {
            color: #000;
            font-weight: bolder;
          }

          .meta_info {
            font-size: 14px;
            color: #8a919f;

            span {
              padding: 7px;
            }
          }
        }

      }
    }
  }
}

.checked {
  color: var(--theme-color);
}
</style>