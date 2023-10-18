<template>
  <div @click="openUser(user)" class="user_item">
    <CustomedAvatar :userInfo="user" :size="60"></CustomedAvatar>
    <div class="author_info">
      <div class="author_name" v-html="highLight(user)"></div>
      <div class="meta_info">
        {{ articleNum }} 文章<span>·</span>{{ followNum }} 个关注者
      </div>
    </div>
    <el-button type="success" :plain="!isFollow" @click.stop="followHandler(user.id)">{{
      isFollow ? '已关注' :
      '关注'
    }}</el-button>
  </div>
</template>

<script setup>
import { ref, inject, watch, onMounted } from 'vue';
import { reqAddFollow, reqDeleteFollow } from '@/api/interaction.js';
import { useRouter } from 'vue-router';
import useSearchStore from '@/store/search.js';
import useUserStore from '@/store/user.js';
import { reqIsFollow, reqFollowNum } from '@/api/interaction.js';
import { reqArticleByUserIdList } from '@/api/search.js'

const props = defineProps(['user', 'isHighLight'])
const router = useRouter()
const loginDialogVisible = inject('loginDialogVisible')
const store = useSearchStore()
const userStore = useUserStore()
const isFollow = ref(false)
const articleNum = ref(0)
const followNum = ref(0)

const highLight = (user) => {
  let reg = new RegExp(store.keyWords, "gi")
  let u = user.nickname || user.username
  return props.isHighLight ? u.replace(reg, `<span style='color:red;font-weight:bolder;'>${store.keyWords}</span>`) : u
}
let followHandler = async (userId) => {
  if (userStore.userInfo.id) {
    if (isFollow.value) {
      await reqDeleteFollow(userStore.userInfo.id, userId)
    } else {
      await reqAddFollow(userStore.userInfo.id, userId)
    }
    isFollow.value = !isFollow.value
  } else {
    loginDialogVisible.value = true
  }
}
const openUser = (user) => {
  let url = router.resolve(`/user/${user.id}`).href
  window.open(url, '_blank')
}
const isFollowHandler = async () => {
  let userId = props.user.id
  if (userStore.userInfo.id) {
    let followResult = await reqIsFollow(userStore.userInfo.id, userId)
    isFollow.value = followResult.data
  } else {
    isFollow.value = false
  }
  let articleNumResult = await reqArticleByUserIdList([userId])
  articleNum.value = articleNumResult.data.length
  let followNumResult = await reqFollowNum(userId)
  followNum.value = followNumResult.data.length
}

watch(() => userStore.userInfo.id, isFollowHandler)
onMounted(() => {
  setTimeout(isFollowHandler, 500)
})
</script>

<style lang="less" scoped>
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
      color: var(--font-color);
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
</style>