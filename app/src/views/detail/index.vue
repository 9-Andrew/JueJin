<template>
  <div class="container">
    <div class="main">
      <div class="content">
        <h1 class="article_title">{{ articleInfo.title }}</h1>
        <div class="author_info_wrapper">
          <CustomedAvatar :userInfo="articleInfo" @click="openInBlank(`/user/${articleInfo.user_id}`)"></CustomedAvatar>
          <div class="author_info">
            <div class="author_name" @click="openInBlank(`/user/${articleInfo.user_id}`)">{{ articleInfo.nickname ||
              articleInfo.username }}</div>
            <div class="meta_info">
              {{ proxy.$moment(articleInfo.create_time).format('YYYY年MM月DD日 HH:mm')
              }}<span>·</span>阅读 {{ articleInfo.view_num + 1 }}
            </div>
          </div>
          <div class="edit"><router-link v-if="store.userInfo.id && articleInfo.user_id == store.userInfo.id"
              :to="`/editor/${route.params.id}`">编辑</router-link></div>
        </div>
        <div class="article_body">
          <MdPreview :editorId="id" :modelValue="articleInfo.content" :showCodeRowNumber="true"
            :theme="settingsStore.isDark == 1 ? 'dark' : 'light'" @onGetCatalog="onGetCatalog" />
        </div>
        <div class="article_end">
          <span class="tag_title">分类:</span>
          <el-tag type="info" size="large" effect="light" @click="openInBlank('/forum/' + articleInfo.path)"> {{
            articleInfo.article_type }} </el-tag>
          <span class="separate"></span>
          <span class="tag_title">标签:</span>
          <el-tag v-for="t in tags" :key="t.tag_id" size="large" effect="light" class="el-tag--default"
            @click="openInBlank('/tag/' + t.tag_id)">{{ t.tag_name }}
          </el-tag>
        </div>
      </div>
      <div v-show="!isImmerse" id="comment" class="comment">
        <Comment></Comment>
      </div>
    </div>
    <div class="sidebar">
      <div v-show="!isImmerse" class="author_info">
        <div class="author_info_wrapper" @click="openInBlank(`/user/${articleInfo.user_id}`)">
          <CustomedAvatar :userInfo="articleInfo"></CustomedAvatar>
          <div class="author_name">{{ articleInfo.nickname || articleInfo.username }}</div>
        </div>
        <div class="operate_btn" v-if="!(store.userInfo.id && articleInfo.user_id == store.userInfo.id)">
          <el-button type="primary" :class="{ followed: isFollow, 'only_icon': isFollowDone }" @click="followHandler">
            <SvgIcon v-if="isFollowDone" name="guanzhuchenggong"></SvgIcon>
            <template v-else>
              <SvgIcon v-if="isFollow" name="duigou"></SvgIcon>{{ isFollow ? '已关注' : '关注' }}
            </template>
          </el-button>
          <el-button type="default" @click="ElMessage.info('功能正在开发中……')">私信</el-button>
        </div>
      </div>
      <div v-if="isShowCatalog" class="article_catalog" :class="{ fixed: isFixed }" ref="catalog">
        <div class="title_box">
          <div class="catalog_title">目录</div>
        </div>
        <MdCatalog :editorId="id" :scrollElement="scrollElement" />
      </div>
    </div>
  </div>
  <div class="article_suspend_panel">
    <el-badge v-show="!isImmerse" :type="isLike ? 'primary' : 'info'" :value="articleInfo.like_num" :max="99999">
      <div class="circle" @click="likeHandler">
        <SvgIcon name="dianzan1" class="icon" :class="{ focus: isLike }"></SvgIcon>
      </div>
    </el-badge>
    <el-badge v-show="!isImmerse" type="info" value="0">
      <div class="circle" @click="toHash">
        <SvgIcon name="pinglun1"></SvgIcon>
      </div>
    </el-badge>
    <el-badge v-show="!isImmerse" :type="isStar ? 'primary' : 'info'" :value="articleInfo.star_num" :max="99999">
      <div class="circle" @click="starHandler">
        <SvgIcon name="shoucang" class="icon" :class="{ star: isStar }"></SvgIcon>
      </div>
    </el-badge>
    <el-badge v-show="!isImmerse" type="info">
      <el-tooltip content="已成功复制链接到剪切板" placement="left" effect="dark" :visible="tooltopVisible">
        <div class="circle" @click="copyLink">
          <SvgIcon name="fenxiang"></SvgIcon>
        </div>
      </el-tooltip>
    </el-badge>
    <el-badge v-show="!isImmerse"> <el-divider></el-divider></el-badge>
    <el-badge type="info">
      <div class="circle" @click="isImmerse = !isImmerse">
        <SvgIcon name="jujiao1" class="icon jujiao" :class="{ focus: isImmerse }"></SvgIcon>
      </div>
    </el-badge>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, getCurrentInstance, nextTick, inject, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleDetail, getArticleTags } from '@/api/article.js'
import { reqAddView, reqIsLike, reqAddLike, reqDeleteLike, reqIsStar, reqAddStar, reqDeleteStar, reqIsFollow, reqAddFollow, reqDeleteFollow } from '@/api/interaction.js';
import useUserStore from '@/store/user.js';
import useSettingsStore from '@/store/settings.js';
import Comment from '@/views/detail/comment/index.vue';
import { ElMessage } from 'element-plus';
import { MdPreview, MdCatalog } from 'md-editor-v3'
// preview.css相比style.css少了编辑器那部分样式
import 'md-editor-v3/lib/preview.css'
const id = 'preview-only'
const scrollElement = document.documentElement

let articleInfo = reactive({})
let tags = reactive([])
const route = useRoute()
const router = useRouter()
const isFixed = ref(false)
const { proxy } = getCurrentInstance()
const isShowCatalog = ref(false)
const store = useUserStore()
const isLike = ref(false)
const loginDialogVisible = inject('loginDialogVisible')
const tooltopVisible = ref(false)
const isStar = ref(false)
const isFollow = ref(false)
const isFollowDone = ref(false)
const immerseValue = ref(localStorage.getItem('isImmerse') == 'true')
const settingsStore = useSettingsStore()
const isImmerse = computed({
  get() {
    return immerseValue.value
  }, set(v) {
    localStorage.setItem('isImmerse', v)
    immerseValue.value = v
  }
})

let handleScroll = proxy.$throttle(() => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  isFixed.value = scrollTop > 130
})
let likeHandler = async () => {
  if (store.userInfo.id) {
    if (isLike.value) {
      await reqDeleteLike(0, store.userInfo.id, route.params.id)
      articleInfo.like_num--
    } else {
      await reqAddLike(0, store.userInfo.id, route.params.id)
      articleInfo.like_num++
    }
    isLike.value = !isLike.value
  } else {
    loginDialogVisible.value = true
  }
}
let isLikeAndStarAndFollowHandler = async () => {
  if (store.userInfo.id) {
    let likeResult = await reqIsLike(0, store.userInfo.id, route.params.id)
    isLike.value = likeResult.data
    let starResult = await reqIsStar(route.params.id, store.userInfo.id)
    isStar.value = starResult.data
    let followResult = await reqIsFollow(store.userInfo.id, articleInfo.user_id)
    isFollow.value = followResult.data
    setTimeout(() => {
      isFollowDone.value = followResult.data
    }, 600);
  } else {
    isLike.value = false
    isStar.value = false
    isFollow.value = false
    isFollowDone.value = false
  }
}
function onGetCatalog(list) {
  isShowCatalog.value = list.length > 0
}
let toHash = () => {
  const commentElement = document.getElementById('comment')
  if (commentElement) {
    commentElement.scrollIntoView({ behavior: 'smooth' })
  }
}
let copyLink = () => {
  navigator.clipboard.writeText(location.href).then(() => {
    tooltopVisible.value = true
    setTimeout(() => {
      tooltopVisible.value = false
    }, 600);
  })
}
let starHandler = async () => {
  if (store.userInfo.id) {
    if (isStar.value) {
      await reqDeleteStar(route.params.id, store.userInfo.id)
      articleInfo.star_num--
      ElMessage.success('取消收藏')
    } else {
      await reqAddStar(route.params.id, store.userInfo.id)
      articleInfo.star_num++
      ElMessage.success('收藏成功！记得常常温习哦~')
    }
    isStar.value = !isStar.value
  } else {
    loginDialogVisible.value = true
  }
}
let followHandler = async () => {
  if (store.userInfo.id) {
    if (isFollow.value) {
      await reqDeleteFollow(store.userInfo.id, articleInfo.user_id)
    } else {
      await reqAddFollow(store.userInfo.id, articleInfo.user_id)
    }
    if (isFollow.value) {
      isFollow.value = false
      isFollowDone.value = false
    } else {
      isFollow.value = true
      setTimeout(() => {
        isFollowDone.value = true
      }, 800);
    }
  } else {
    loginDialogVisible.value = true
  }
}
const openInBlank = (path) => {
  let url = router.resolve(path).href
  window.open(url, '_blank')
}

watch(() => store.userInfo.id, isLikeAndStarAndFollowHandler)
onMounted(async () => {
  let result = await getArticleDetail(parseInt(route.params.id))
  if (!result.data) {
    ElMessage.info(result.message)
    router.push('/404')
    return
  }
  Object.assign(articleInfo, result.data)
  let tagResult = await getArticleTags(parseInt(route.params.id))
  tagResult.data && tags.push(...tagResult.data)

  await reqAddView(route.params.id)
  isLikeAndStarAndFollowHandler()
  nextTick(() => { document.title = articleInfo.title + ' - ' + import.meta.env.VITE_APP_TITLE })
  window.addEventListener('scroll', handleScroll)
  if (window.location.hash === '#comment') {
    toHash()
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="less" scoped>
.container {
  width: 1300px;
  margin: auto;
  display: flex;
  justify-content: space-around;

  .main {
    width: 1000px;

    .content {
      padding: 32px;
      background-color: var(--background-color);
      border-radius: var(--box-radius);

      .article_title {
        font-weight: 700;
        margin-top: 0;
      }

      .author_info_wrapper {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .author_info {
          margin-left: 12px;

          .author_name {
            cursor: pointer;
          }

          .meta_info {
            font-size: 14px;
            color: #8a919f;

            span {
              padding: 10px;
            }
          }
        }

        .edit {
          flex-grow: 1;
          height: 46px;
          line-height: 46px;

          a {
            float: right;

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }

      .article_body {
        font: 16px 'Segoe UI', Roboto, Ubun;
        color: #252933;
        line-height: 28px;
      }

      .article_end {
        padding-top: 30px;

        .tag_title {
          margin-right: 8px;
        }

        .separate {
          width: 32px;
          display: inline-block;
        }

        .el-tag--info {
          color: #515767;
        }

        .el-tag--default {
          color: var(--theme-color);
        }

        .el-tag {
          cursor: pointer;
        }
      }
    }

    .comment {
      margin-top: 20px;
      padding: 32px;
      background-color: var(--background-color);
      border-radius: var(--box-radius);
    }
  }

  .sidebar {
    width: 250px;

    .author_info {
      margin-bottom: 20px;
      background-color: var(--background-color);
      border-radius: var(--box-radius);
      padding: 20px;

      .author_info_wrapper {
        display: flex;
        align-items: center;
        margin-bottom: 17px;
        cursor: pointer;

        .author_name {
          margin-left: 12px;
        }
      }

      .operate_btn {
        display: flex;
        justify-content: space-between;

        .el-button {
          flex-grow: 1;
          transition: all .3s ease-out;
        }

        .followed {
          background: #fff !important;
          border-color: #e4e6eb !important;
          color: #8a919f !important;
        }

        .only_icon {
          flex-grow: 0;
        }

      }
    }

    .article_catalog {
      border-radius: var(--box-radius);
      background-color: var(--background-color);

      .title_box {
        padding: 0 20px;

        .catalog_title {
          padding: 16px 0px;
          border-bottom: 1px solid #e4e6eb;
        }
      }

      .md-editor-catalog {
        padding: 12px;
        margin-right: 5px;
        overflow: auto;
        max-height: 600px;

        &::-webkit-scrollbar {
          width: 6px;
          /* 滚动条宽度 */
        }

        &::-webkit-scrollbar-track {
          background-color: var(--background-color);
          /* 滚动条背景颜色 */
          border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #e4e6eb;
          /* 滚动条滑块颜色 */
          border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb:hover {
          background-color: #e4e6eb;
          /* 滚动条滑块悬停时颜色 */
        }
      }
    }

    .fixed {
      position: fixed;
      top: 75px;
      width: 250px;
    }
  }
}

.article_suspend_panel {
  position: fixed;
  top: 150px;
  display: flex;
  flex-direction: column;

  .el-badge {
    cursor: pointer;
    width: 100%;
    margin-bottom: 20px;

    &:hover .circle {
      .icon {
        fill: #515767;
      }

      .jujiao {
        stroke: #515767;
      }
    }

    .circle {
      width: 48px;
      height: 48px;
      border-radius: 50% 50%;
      box-shadow: 0 2px 8px rgba(50, 50, 50, 0.04);
      background-color: var(--background-color);
      display: flex;
      justify-content: center;
      align-items: center;
      transform: translate(14%, -14%);

      .icon {
        width: 20px;
        height: 20px;
        fill: #8a919f;
      }

      .jujiao {
        stroke: #8a919f;
        stroke-width: 70px;
      }

      .focus {
        fill: var(--theme-color) !important;
        stroke: var(--theme-color) !important;
      }

      .star {
        fill: #ffb800 !important;
        stroke: #ffb800 !important;
      }
    }

    :deep(.el-badge__content--info) {
      background-color: #c2c8d1;
    }

    .el-divider {
      transform: translate(14%, -14%);
      margin: 0;
      margin-bottom: 8px;
    }
  }
}

.md-editor-previewOnly {
  background-color: transparent;
}
</style>
