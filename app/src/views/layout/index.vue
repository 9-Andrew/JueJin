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
              <router-link to="/">首页</router-link>
            </li>
            <li>
              <router-link to="/forum/follow">关注</router-link>
            </li>
            <li v-for="at in articleType" :key="at.id">
              <router-link :to="`/forum/${at.path}`">{{ at.name }}</router-link>
            </li>
          </ul>
        </el-col>
        <el-col :span="6" class="flexContainer"
          ><el-input v-model="input1" class="search" placeholder="搜索" :suffix-icon="Search" />
        </el-col>
        <el-col :span="4" class="flexContainer" :offset="2">
          <el-button type="primary" @click="writeArticle">写文章</el-button>
          <el-button v-if="!username" type="default" @click="loginDialogVisible = true"
            >登录 | 注册</el-button
          >

          <div v-else class="userInfo">
            <el-dropdown>
              <el-badge :value="2" class="item">
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
              <el-avatar :size="36"> {{ username }}</el-avatar>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>我的主页</el-dropdown-item>
                  <el-dropdown-item>
                    <el-popconfirm
                      width="220"
                      confirm-button-text="确认"
                      cancel-button-text="取消"
                      :icon="InfoFilled"
                      icon-color="#626AEF"
                      title="确定登出吗？"
                      @confirm="logout"
                    >
                      <template #reference>退出登录</template>
                    </el-popconfirm></el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <teleport to="body"
            ><LoginDialog
              v-model:loginDialogVisible="loginDialogVisible"
              @initUserInfo="initUserInfo"
            ></LoginDialog
          ></teleport>
        </el-col>
      </el-row>
    </el-header>

    <el-main class="bx">
      <RouterView />
    </el-main>
  </el-container>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, reactive, getCurrentInstance, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import LoginDialog from '@/views/layout/LoginDialog.vue'
import { useUserInfo } from '@/stores/index.js'
import { getUserInfo } from '@/api/userinfo.js'
import { getArticleType } from '@/api/article.js'
import { InfoFilled } from '@element-plus/icons-vue'

const input1 = ref('')
const loginDialogVisible = ref(false)
const isHideHeader = ref(false)
const articleType = reactive([])
const store = useUserInfo()
const { proxy } = getCurrentInstance()
let username = computed(() => store.userInfo.username)
let router=useRouter()

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
  initScrollTop = currentScrollTop
}, 50)

onMounted(() => {
  initArticleType()
  initUserInfo()
  window.addEventListener('scroll', initScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', initScroll)
})

async function initUserInfo() {
  if (localStorage.getItem('Token')) {
    let { data } = await getUserInfo()
    store.setUserInfo(data)
  }
}

function logout() {
  localStorage.clear()
  store.$reset()
}

async function initArticleType() {
  const result = await getArticleType()
  articleType.splice(0, 0, ...result.data)
}

function writeArticle() {
  if (!username.value) {
    loginDialogVisible.value=true
  }else{
    router.push('/write')
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  transition: top;
  width: 100%;
  z-index: 999;
  .navbar {
    margin: 0 auto;
  }
  .flexContainer {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .logo {
      background: url('@/assets/logo.png') no-repeat;
      background-size: contain;
      height: 45px;
      width: 100%;
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
        color: #000;
        display: block;
      }
      &:hover {
        &::after {
          content: '';
          display: block;
          width: 100%;
          height: 3px;
          background-color: @mainColor;
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
//显示时按钮样式
.el-button--primary {
  //需要更改的按钮类型 type='primary'
  background: var(--theme-color) !important;
  border-color: var(--theme-color) !important;
  width: 130px;
}
//移入时按钮样式 type='primary'
.el-button--primary:hover {
  background: #0e5bc0 !important;
  border-color: #0e5bc0 !important;
  color: #fff !important;
  opacity: 0.8;
}
.el-button--default {
  //需要更改的按钮类型 type='default'
  background: #f4f9ff !important;
  border-color: #1d7efc !important;
  color: #007fff !important;
}
//移入时按钮样式type='default'
.el-button--default:hover {
  background: #fff !important;
  border-color: #45a3fc !important;
  color: #3599f5 !important;
  opacity: 0.8;
}
.userInfo {
  display: flex;
  align-items: center;
  .el-dropdown {
    margin: 0 18px;
    .el-badge,
    .el-avatar {
      cursor: pointer;
    }
  }
}
.HideHeader {
  top: -60px;
}
</style>
