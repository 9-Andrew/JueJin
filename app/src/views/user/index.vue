<template>
  <div class="container">
    <div class="main">
      <div class="profile">
        <CustomedAvatar class="avatar" :userInfo="{ username: '111' }" :size="74"></CustomedAvatar>
        <div class="username">安玖</div>
        <div class="btn_container">
          <el-button v-if="store.userInfo.id && store.userInfo.id == route.params.id" type="default" style="width: 120px;"
            @click="router.push('/setting')">设置</el-button>
          <div class="operate_btn" v-else>
            <el-button type="primary" :class="{ followed: isFollow, 'only_icon': isFollowDone }" @click="followHandler">
              <SvgIcon v-if="isFollowDone" name="guanzhuchenggong"></SvgIcon>
              <template v-else>
                <SvgIcon v-if="isFollow" name="duigou"></SvgIcon>{{ isFollow ? '已关注' : '关注' }}
              </template>
            </el-button>
            <el-button type="default" @click="ElMessage.info('功能正在开发中……')">私信</el-button>
          </div>
        </div>
      </div>
      <div class="list_block">
        <div class="tab_container" :class="{ active: isSearch }">
          <div class="header">
            <div v-for="(item, index) in panes" :key="index" :class="{ active: activeIndex == index }"
              @click="activeIndex = index">{{ item }}</div>
            <SvgIcon name="sousuo" @click="isSearch = true"></SvgIcon>
          </div>
          1
        </div>
        <div class="search_container" :class="{ active: isSearch }">
          <div class="header">
            <div class="search_show" @click="isSearch = false">
              <div class="search_return">
                <SvgIcon name="fanhui"></SvgIcon>
                返回
              </div>
              搜索文章
            </div>
            <el-input class="search" :class="{ active: isSearch }" placeholder="搜索 发布/点赞/收藏的文章" suffix-icon="Search" />
          </div>
          2
        </div>
      </div>
    </div>
    <div class="sidebar">
      <div class="fixed_container">
        <div class="follow_block">
          <div class="follow_num">关注了<span>5</span></div>
          <div class="followed_num">关注者<span>0</span></div>
        </div>
        <div class="more_item"><span class="title">收藏文章</span>
          <div class="value">14</div>
        </div>
        <div class="more_item"><span class="title">加入于</span>
          <div class="value">2023-04-12</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import useUserInfoStore from '@/store/user.js';

const router = useRouter()
const route = useRoute()
const store = useUserInfoStore()
const isFollow = ref(false)
const isFollowDone = ref(false)
const activeIndex = ref(0)
const panes = ref(['文章', '草稿', '收藏', '关注', '赞'])
const isSearch = ref(false)

const followHandler = () => { }
</script>

<style lang="less" scoped>
.container {
  margin: 0 auto;
  width: 1000px;
  display: flex;
  justify-content: space-around;

  .main {
    flex-grow: 1;

    .profile {
      display: flex;
      align-items: center;
      padding: 30px;
      background-color: var(--background-color);

      .avatar {
        margin-right: 30px;
        cursor: default;
      }

      .username {
        flex-grow: 1;
        font-size: 20px;
        font-weight: bold;
      }

      .btn_container {
        align-self: flex-end;

        .operate_btn {
          display: flex;
          justify-content: space-between;

          .el-button {
            flex: 1 1 auto;
            transition: all .9s;
            width: 100px;
          }

          .followed {
            background: #fff !important;
            border-color: #e4e6eb !important;
            color: #8a919f !important;
          }

          .only_icon {
            max-width: 28px;
          }

        }
      }
    }

    .list_block {
      background-color: var(--background-color);
      margin-top: 12px;
      display: flex;
      overflow: hidden;

      .tab_container {
        width: 100%;
        flex-shrink: 0;
        transition: all .5s ease-in-out;

        .header {
          position: relative;
          display: flex;
          align-items: center;
          border-bottom: 2px solid var(--border-color);
          height: 48px;
          padding-left: 8px;

          div {
            padding: 12px;
            margin-right: 4px;
            cursor: pointer;
            display: flex;
            justify-content: center;
          }

          div:not(.active):hover {
            color: #747985;
          }

          div.active::after {
            content: '';
            display: block;
            width: 16px;
            height: 3px;
            background-color: #1e80ff;
            border-radius: 50px;
            position: absolute;
            bottom: 0px;
          }

          svg {
            position: absolute;
            right: 20px;
            cursor: pointer;
          }


        }

        &.active {
          transform: translateX(-100%);
          opacity: .3;
        }
      }

      .search_container {
        width: 100%;
        flex-shrink: 0;
        transition: all .3s ease-in-out;

        .header {
          height: 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          padding: 0 20px;

          .search_show {
            display: flex;
            align-items: center;

            .search_return {
              padding-right: 10px;
              margin-right: 10px;
              color: #515767;
              cursor: pointer;
              border-right: 1px solid #e6e6ee;
              height: 16px;
              display: flex;
              align-items: center;

              svg {
                width: 20px;
                height: 20px;
                margin-right: 4px;
                color: #515767;
              }
            }

          }

          .search {
            transition: .3s;
            transition-delay: .4s;
            width: 20px;
          }

          .search.active {
            width: 264px;
          }

        }

        &.active {
          transform: translateX(-100%);
        }
      }
    }
  }

  .sidebar {
    width: 250px;
    margin-left: 20px;

    .fixed_container {
      position: fixed;
      top: 75px;

      .follow_block {
        padding: 16px 0;
        margin-bottom: 12px;
        width: 250px;
        background-color: var(--background-color);
        display: flex;
        text-align: center;
        color: #31445B;
        font-size: 16px;
        cursor: pointer;

        .follow_num {
          flex-grow: 1;
          border-right: 1px solid var(--border-color);
        }

        .followed_num {
          flex-grow: 1;
        }

        span {
          display: block;
          font-size: 15px;
          font-weight: bold;
        }
      }

      .more_item {
        padding: 15px 5px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgba(230, 230, 231, .5);

        &:nth-of-type(2) {
          border-top: 1px solid rgba(230, 230, 231, .5);
        }

      }
    }
  }
}
</style>