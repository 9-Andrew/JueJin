<template>
  <el-container class="common-layout">
    <el-header>
      <el-row class="bx">
        <el-col :span="2" class="flexContainer">
          <router-link class="logo" to="/"></router-link>
        </el-col>
        <el-col :span="10">
          <ul class="nav">
            <li>
              <router-link to="/">首页</router-link>
            </li>
            <li>
              <router-link to="specialColumn">专栏</router-link>
            </li>
            <li>
              <router-link to="/collect">收藏集</router-link>
            </li>
            <li>
              <router-link to="/discover">发现</router-link>
            </li>
            <li>
              <router-link to="/openSource">开源库</router-link>
            </li>
          </ul>
        </el-col>
        <el-col :span="6" class="flexContainer"
          ><el-input v-model="input1" class="search" placeholder="搜索" :suffix-icon="Search" />
        </el-col>
        <el-col :span="4" class="flexContainer" :offset="2">
          <el-button type="primary">写文章</el-button>
          <el-button type="default" @click="loginDialogVisible=true">登录 | 注册</el-button>
          <LoginDialog v-model:loginDialogVisible="loginDialogVisible"></LoginDialog>
        </el-col>
      </el-row>
    </el-header>

    <el-main class="bx">
      <RouterView />
    </el-main>
  </el-container>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import LoginDialog from '@/views/layout/LoginDialog.vue';

const input1 = ref('')
const loginDialogVisible=ref(false)
</script>

<style lang="less" scoped>
.el-header {
  background: #fff;

  .flexContainer {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .logo {
      background: url('@/assets/logo.png') no-repeat;
      background-size: contain;
      height: 30px;
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
  background: #1e80ff !important;
  border-color: #1e80ff !important;
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
</style>
