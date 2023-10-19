<template>
  <div class="container">
    <div class="main">
      <div class="profile">
        <CustomedAvatar class="avatar" :userInfo="userInfo" :size="74"></CustomedAvatar>
        <div class="username">{{ userInfo.nickname || userInfo.username }}</div>
        <div class="btn_container">
          <el-button v-if="store.userInfo.id && store.userInfo.id == userId" type="default" style="width: 120px;"
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
            <div v-for="(item, index) in panes" v-show="index != 1 || (store.userInfo.id && store.userInfo.id == userId)"
              :key="index" :class="{ active: activeIndex == index }" @click="getData(index)">{{ item }}</div>
            <SvgIcon name="sousuo" @click="changeIsSearch(true)"></SvgIcon>
          </div>
          <div v-if="activeIndex != 3">
            <ArticleItem v-for="al in articleList" :key="al.id" :article="al"></ArticleItem>
          </div>
          <div v-else>
            <div class="follow_sub_tab">
              <div class="sub_tab_title">关注</div>
              <ul class="sub_tab_box">
                <li v-for="(item, index) in followTabs" :key="index" :class="{ active: followTabIndex == index }"
                  @click="switchTab(3, index)">{{ item }}</li>
              </ul>
            </div>
            <UserItem v-for="ul in userList" :key="ul.id" :user="ul"></UserItem>
          </div>
          <el-skeleton v-if="isLoading" :rows="8" :loading="isLoading" animated />
          <el-empty v-if="!isLoading && articleList.length == 0 && userList.length == 0" description="暂无内容"></el-empty>
        </div>
        <div class="search_container" :class="{ active: isSearch }">
          <div class="header">
            <div class="search_show" @click="changeIsSearch(false)">
              <div class="search_return">
                <SvgIcon name="fanhui"></SvgIcon>
                返回
              </div>
              搜索文章
            </div>
            <el-input v-model="keyWords" ref="searchInput" placeholder="搜索 发布/点赞/收藏的文章" class="search"
              :class="{ active: isSearch }" clearable @keyup.enter="search(false)">
              <template #append>
                <el-button icon="Search" @click="search(false)" />
              </template>
            </el-input>
          </div>
          <el-skeleton v-if="isLoading" :rows="8" :loading="isLoading" animated />
          <ArticleItem v-for="al in articleList" :key="al.id" :article="al" :keyWords="keyWordsProps"></ArticleItem>
          <el-empty v-if="!isLoading && articleList.length == 0"
            :description="keyWordsProps ? '暂无相关内容' : '输入关键词，找找 TA 发布/点赞/收藏的文章~'"></el-empty>
        </div>
      </div>
    </div>
    <div class="sidebar">
      <div class="fixed_container">
        <div class="follow_block">
          <div class="follow_num" @click="switchTab(3, 0)">关注了<span>{{ userInfo.followNum }}</span>
          </div>
          <div class="followed_num" @click="switchTab(3, 1)">关注者<span>{{ userInfo.followedNum
          }}</span>
          </div>
        </div>
        <div class="more_item star_item" @click="switchTab(2)"><span class="title">收藏文章</span>
          <div class="value">{{ userInfo.starredNum }} </div>
        </div>
        <div class="more_item"><span class="title">加入于</span>
          <div class="value">{{ proxy.$moment(userInfo.create_time).format('YYYY-MM-DD') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, getCurrentInstance, computed, inject, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useUserInfoStore from '@/store/user.js';
import { reqUserInfo } from '@/api/user';
import { reqFollowNum, reqFollowedNum, reqDeleteFollow, reqAddFollow, reqIsFollow } from '@/api/interaction';
import { ElMessage } from 'element-plus';
import { reqArticleByUserId, reqStarredArticleByUserId, reqLikedArticleByUserId, reqArticleByKeyWordsFromPublishedAndStarredAndLiked } from '@/api/search.js';
import { reqUserListByUserIdList } from '@/api/search.js';
import ArticleItem from '@/components/ArticleItem/index.vue'


const router = useRouter()
const route = useRoute()
const store = useUserInfoStore()
const isFollow = ref(false)
const isFollowDone = ref(false)
const activeIndex = ref(0)
const panes = ref(['文章', '草稿', '收藏', '关注', '赞'])
const followTabIndex = ref(0)
const followTabs = ref(['关注的用户', '关注者'])
const isSearch = ref(false)
const userInfo = ref({
  followNum: 0,
  followedNum: 0,
  starredNum: 0
})
const { proxy } = getCurrentInstance()
const loginDialogVisible = inject('loginDialogVisible')
const userId = computed(() => parseInt(route.params.id))
const isLoading = ref(true)
const page = ref(1)
const limit = ref(10)
const articleList = ref([])
const userList = ref([])
const keyWords = ref('')
let keyWordsProps = ''
const searchInput = ref()

const followHandler = async () => {
  if (store.userInfo.id) {
    if (isFollow.value) {
      await reqDeleteFollow(store.userInfo.id, userId.value)
    } else {
      await reqAddFollow(store.userInfo.id, userId.value)
    }
    if (isFollow.value) {
      isFollow.value = false
      isFollowDone.value = false
    } else {
      isFollow.value = true
      setTimeout(() => {
        isFollowDone.value = true
      }, 600);
    }
  } else {
    loginDialogVisible.value = true
  }
}
const isFollowHandler = async () => {
  if (store.userInfo.id) {
    let followResult = await reqIsFollow(store.userInfo.id, userId.value)
    isFollow.value = followResult.data
    setTimeout(() => {
      isFollowDone.value = followResult.data
    }, 600);
  } else {
    isFollow.value = false
    isFollowDone.value = false
  }
}
watch(() => store.userInfo.id, isFollowHandler)
const getUserInfo = async () => {
  // 获取用户基本信息
  const result = await reqUserInfo(userId.value)
  if (!result.data) {
    ElMessage.info(result.message)
    router.push('/404')
    return
  }
  userInfo.value = result.data
  const followNumResult = await reqFollowNum(userId.value)
  const followedNumResult = await reqFollowedNum(userId.value)
  userInfo.value.followNum = followNumResult.data.length
  userInfo.value.followedNum = followedNumResult.data.length
  isFollowHandler()
}
const getData = async (index, isPush) => {
  let result
  if (!isPush) {
    articleList.value.length = 0
    userList.value.length = 0
    isLoading.value = true
    page.value = 1
  }
  activeIndex.value = index
  if (activeIndex.value == 0 || activeIndex.value == 1) {
    result = await reqArticleByUserId(page.value, limit.value, userId.value, activeIndex.value == 0 ? 1 : 0)
  } else if (activeIndex.value == 2) {
    result = await reqStarredArticleByUserId(page.value, limit.value, userId.value)
  } else if (activeIndex.value == 4) {
    result = await reqLikedArticleByUserId(page.value, limit.value, userId.value)
  } else {
    if (followTabIndex.value == 0) {
      result = await reqFollowNum(userId.value)
    } else {
      result = await reqFollowedNum(userId.value)
    }
    let userIdList = result.data.map(item => followTabIndex.value == 0 ? item.followed_user_id : item.user_id)
    result = await reqUserListByUserIdList(page.value, limit.value, userIdList)
  }
  setTimeout(() => {
    isLoading.value = false
    if (activeIndex.value != 3) {
      result.data && articleList.value.push(...result.data)
    } else {
      result.data && userList.value.push(...result.data)
    }
  }, 400)
}
const switchTab = (aIndex, fIndex) => {
  activeIndex.value = aIndex
  typeof fIndex == 'number' && (followTabIndex.value = fIndex)
  getData(activeIndex.value)
}
const loadingMore = proxy.$throttle(() => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  let clientHeight = document.documentElement.clientHeight
  let scrollHeight = document.documentElement.scrollHeight
  if (scrollTop + clientHeight >= scrollHeight) {
    page.value++
    isSearch.value ? search(true) : getData(activeIndex.value, true)
  }
}, 1000)
watch(() => route.params.id, () => {
  if (route.fullPath.indexOf('/user') != -1) {
    getUserInfo()
    getData(activeIndex.value)
  }
})
const search = async (isPush) => {
  if (keyWords.value.length==0) {
    return
  }
  if (!isPush) {
    articleList.value.length = 0
    isLoading.value = true
    page.value = 1
  }
  keyWordsProps = keyWords.value
  const result = await reqArticleByKeyWordsFromPublishedAndStarredAndLiked(page.value, limit.value, userId.value, keyWords.value)
  setTimeout(() => {
    isLoading.value = false
    result.data && articleList.value.push(...result.data)
  }, 400)
  searchInput.value.blur()
}
const changeIsSearch = (value) => {
  isSearch.value = value
  articleList.value.length = 0
  page.value = 1
  keyWords.value = ''
  keyWordsProps = ''
  value || getData(activeIndex.value)
}


onMounted(async () => {
  getUserInfo()
  const result = await reqStarredArticleByUserId(page.value, limit.value, userId.value)
  userInfo.value.starredNum = result.total
  getData(activeIndex.value)
  window.addEventListener('scroll', loadingMore, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', loadingMore)
})
</script>

<style lang="less" scoped>
.container {
  margin: 0 auto;
  width: 1000px;
  display: flex;
  justify-content: space-around;

  .main {
    flex: 1;
    overflow: hidden;

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
        width: 210px;

        &>.el-button {
          float: right;
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

        .follow_sub_tab {
          height: 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 28px;
          border-bottom: 2px solid rgba(230, 230, 231, .5);

          .sub_tab_title {
            font-weight: bold;
          }

          .sub_tab_box {
            display: flex;
            color: #72777b;

            li {
              cursor: pointer;
              padding: 0 12px;
              position: relative;

              &:not(li:first-child)::before {
                content: '';
                width: 1px;
                height: 70%;
                background-color: var(--border-color);
                display: block;
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
              }

              &.active {
                color: #000;
              }
            }


          }
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
          border-bottom: 1px solid var(--border-color);

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
            width: 240px;
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

        &.star_item {
          cursor: pointer;
        }
      }
    }
  }
}
</style>