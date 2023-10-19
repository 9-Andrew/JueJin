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
    <el-skeleton v-if="store.loading" :rows="8" :loading="store.loading" animated />
    <div class="content" v-else>
      <el-empty v-if="store.resultList.length == 0" description="暂无内容"></el-empty>
      <div v-else>
        <div class="article-container" v-if="store.categoryParams != 2">
          <ArticleItem v-for="rl in store.resultList" :key="rl.id" :article="rl" :keyWords="route.query.keyWords">
          </ArticleItem>
        </div>
        <div class="user-container" v-else>
          <UserItem v-for="rl in store.resultList" :key="rl.id" :user="rl" :isHighLight="true"></UserItem>
        </div>
        <el-pagination v-model:current-page="store.pageNo" v-model:page-size="limit" background :page-sizes="[10, 20, 30]"
          layout=" prev, pager, next, jumper,->,sizes,total" :total="store.total"
          @current-change="goTop();store.getData(store.pageNo, limit)" @size-change="goTop();store.getData(store.pageNo, limit)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, inject } from 'vue';
import useSearchStore from '@/store/search.js';
import ArticleItem from '@/components/ArticleItem/index.vue'
import UserItem from '@/components/UserItem/index.vue';
import { useRoute } from 'vue-router';

const category = ['综合', '文章', '用户']
const sort = ['综合排序', '最新优先', '最热优先']
const limit = ref(20)
const isTeleportReady = ref(false)
const store = useSearchStore()
const route = useRoute()
const goTop=inject('goTop')

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
  background: linear-gradient(var(--border-color), var(--background-color) 8%);
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
  background: var(--background-color);

  .sort {
    display: flex;
    height: 54px;
    line-height: 54px;
    border-bottom: 1px solid var(--border-color);

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
  }
}

.checked {
  color: var(--theme-color);
}
</style>