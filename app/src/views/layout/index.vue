<template>
  <el-container class="common-layout">
    <el-header :class="{ HideHeader: isHideHeader }">
      <el-row class="bx navbar">
        <el-col :span="2" class="flexContainer">
          <router-link class="logo" to="/"></router-link>
        </el-col>
        <el-col :span="10">
          <ul class="nav">
            <li>
              <router-link to="/" :class="{ highLight: route.path == '/' }">首页</router-link>
            </li>
            <li>
              <router-link to="/forum/follow" :class="{ highLight: route.path == '/forum/follow' }">关注</router-link>
            </li>
            <li v-for="at in articleType" :key="at.id">
              <router-link :to="`/forum/${at.path}`" :class="{ highLight: route.path == `/forum/${at.path}` }">{{ at.name
              }}</router-link>
            </li>
          </ul>
        </el-col>
        <el-col :span="6" class="flexContainer">
          <el-input v-model="searchStore.keyWords" ref="searchInput" placeholder="搜索" clearable @focus="isFocus = true"
            @blur="isFocus = false" @keyup.enter="search">
            <template #append>
              <el-button :type="isFocus ? 'default' : ''" icon="Search" @click="search" />
            </template>
          </el-input>
          <div class="searchHistory" v-show="isFocus && !searchStore.keyWords && searchStore.searchHistory.length > 0"
            @mousedown.prevent="">
            <div class="header">
              <span>搜索历史</span>
              <a href="" @click.prevent="clearSearchHistory">清空</a>
            </div>
            <div class="item" v-for="(sh, index) in searchStore.searchHistory" :key="index"
              @click="searchStore.keyWords = sh; search()">{{ sh }}</div>
          </div>
        </el-col>
        <el-col :span="4" class="flexContainer" :offset="2">
          <el-button type="primary" @click="writeArticle">写文章</el-button>
          <el-button v-if="!isLogin" type="default" @click="loginDialogVisible = true">登录 | 注册</el-button>
          <div v-else class="userInfo">
            <el-dropdown>
              <el-badge class="item">
                <el-icon :size="24">
                  <BellFilled />
                </el-icon>
              </el-badge>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>评论</el-dropdown-item>
                  <el-dropdown-item>赞和收藏</el-dropdown-item>
                  <el-dropdown-item>新增粉丝</el-dropdown-item>
                  <el-dropdown-item>私信</el-dropdown-item>
                  <el-dropdown-item>系统通知</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-dropdown trigger="click" size="large">
              <CustomedAvatar :userInfo="userInfoStore.userInfo"></CustomedAvatar>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="router.push(`/user/${userInfoStore.userInfo.id}`)">我的主页</el-dropdown-item>
                  <el-dropdown-item @click="router.push(`/setting`)">我的设置</el-dropdown-item>
                  <el-dropdown-item>
                    <el-popconfirm width="220" confirm-button-text="确认" cancel-button-text="取消" icon="InfoFilled"
                      icon-color="#626AEF" title="确定登出吗？" @confirm="logout">
                      <template #reference>退出登录</template>
                    </el-popconfirm></el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <teleport to="body">
            <LoginDialog v-model:loginDialogVisible="loginDialogVisible"></LoginDialog>
          </teleport>
        </el-col>
      </el-row>
    </el-header>

    <el-main class="bx main">
      <RouterView />
    </el-main>
  </el-container>
  <div id="go_top" v-if="!route.meta.hiddenGoTop && isShowGoTop" @click="goTop">
    <SvgIcon name="back-top1_fill"></SvgIcon>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, reactive, getCurrentInstance, computed, provide } from 'vue'
import LoginDialog from '@/views/layout/LoginDialog/index.vue'
import useUserInfoStore from '@/store/user'
import useSearchStore from '@/store/search';
import { getArticleType } from '@/api/article.js'

const loginDialogVisible = ref(false)
provide('loginDialogVisible', loginDialogVisible)
provide('goTop', goTop)
const isHideHeader = ref(false)
const articleType = reactive([])
const userInfoStore = useUserInfoStore()
const searchStore = useSearchStore()
const { proxy } = getCurrentInstance()
const searchInput = ref()
let isLogin = computed(() => userInfoStore.userInfo.id)
let router = useRouter()
let route = useRoute()
let isShowGoTop = ref(false)
let isFocus = ref(false)


// 获取滚动条高度
function getScrollTop() {
  return document.documentElement.scrollTop || window.pageYOffset
}
let initScrollTop = getScrollTop()
let initScroll = proxy.$debounce(() => {
  let currentScrollTop = getScrollTop()
  if (currentScrollTop > initScrollTop && currentScrollTop > 1000) {
    isHideHeader.value = true
  } else {
    isHideHeader.value = false
  }
  isShowGoTop.value = currentScrollTop > 1200
  initScrollTop = currentScrollTop
}, 50)

onMounted(() => {
  initArticleType()
  userInfoStore.initUserInfo()
  window.addEventListener('scroll', initScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', initScroll)
})


function logout() {
  localStorage.clear()
  userInfoStore.$reset()
}

async function initArticleType() {
  const result = await getArticleType()
  articleType.splice(0, 0, ...result.data)
}

function writeArticle() {
  if (!isLogin.value) {
    loginDialogVisible.value = true
  } else {
    router.push('/editor')
  }
}

function goTop() {
  scrollTo(0, 0)
}
function search() {
  if (searchStore.keyWords) {
    router.push(`/search?keyWords=${searchStore.keyWords}`)
    searchStore.getData()
  }
  searchInput.value.blur()
}
function clearSearchHistory() {
  searchStore.searchHistory.length = 0
  localStorage.removeItem('searchHistory')
}
</script>

<style lang="less" scoped>
.el-header {
  background: var(--background-color);
  position: fixed;
  top: 0;
  left: 0;
  transition: top .3s;
  width: 100%;
  z-index: 999;

  .navbar {
    margin: 0 auto;
  }

  .flexContainer {
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: relative;

    .logo {
      background: url('@/assets/logo.png') no-repeat;
      background-size: contain;
      height: 45px;
      width: 100%;
    }

    .searchHistory {
      position: absolute;
      top: 48px;
      right: 0;
      width: 100%;
      background: var(--search-item-background-color);
      line-height: 24px;
      font-size: 12px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
      border: 1px solid var(--border-color);
      border-radius: var(--box-radius);
      z-index: 3;

      .header {
        padding: 6px 12px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid var(--border-color);

        span {
          color: #8a919f;
        }
      }

      .item {
        cursor: pointer;
        padding: 6px 12px;

        &:hover {
          background-color: var(--search-item-background-color-hover);
        }
      }
    }
  }

  .nav {
    display: flex;
    padding: 0 200px 0 40px;
    text-align: center;
    height: 100%;
    line-height: 60px;

    li {
      flex: auto;
      position: relative;

      a {
        color: var(--font-color);
        display: block;
      }

      .highLight {
        color: var(--theme-color)
      }

      &:hover {
        &::after {
          content: '';
          display: block;
          width: 100%;
          height: 3px;
          background-color: var(--theme-color);
          position: absolute;
          transform: translateY(-100%);
        }
      }
    }
  }

  .search {
    margin: auto;
  }
}

.el-main {
  margin: 60px auto 12px;
  padding: 0;
  // 必须设置高度，否则动态加载内容时，进度条显示会导致页面跳动
  min-height: 100vh;
}

.el-row {
  height: 100%;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 60px;
}

.el-button--primary {
  width: 130px;
}

.userInfo {
  display: flex;
  align-items: center;

  .el-dropdown {
    margin: 0 18px;

    .el-badge {
      cursor: pointer;
    }
  }
}

.HideHeader {
  top: -60px;
}

.main {
  padding-top: 15px;
}

#go_top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50% 50%;
  box-shadow: 0 2px 8px rgba(50, 50, 50, 0.04);
  background-color: var(--background-color);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  .icon {
    fill: #8a919f;
  }
}
</style>
