<template>
  <div class="tag_info">
    <h2>{{ tagName }}</h2>
    <div class="tag_meta">{{ total }} 篇文章</div>
  </div>
  <div class="container">
    <ul class="sort">
      <li v-for="(item, index) in sort" :key="index" :class="{ checked: sortParams == index }"
        @click="setSortParams(index)">
        <el-divider v-if="index != 0" direction="vertical"></el-divider>
        {{ item }}
      </li>
    </ul>
    <el-skeleton v-if="loading" :rows="10" :loading="loading" animated />
    <div class="content" v-else>
      <el-empty v-if="resultList.length == 0" description="暂无内容"></el-empty>
      <div v-else>
        <div class="article-container">
          <ArticleItem v-for="rl in resultList" :key="rl.id" :article="rl">
          </ArticleItem>
        </div>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" background :page-sizes="[10, 20, 30]"
          layout=" prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="goTop();getData()"
          @size-change="pageNo = 1;goTop(); getData()" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted,inject } from 'vue';
import ArticleItem from '@/components/ArticleItem/index.vue'
import { useRoute,useRouter } from 'vue-router';
import { reqArticleByTagId } from '@/api/search.js';
import { ElMessage } from 'element-plus';

const sort = ['热门', '最新', '最热']
const limit = ref(10)
const route = useRoute()
const router = useRouter()
const pageNo = ref(1)
const sortParams = ref(0)
const resultList = ref([])
const total = ref(0)
const tagName = ref('')
const loading = ref(true)
const goTop=inject('goTop')

const getData = async () => {
  loading.value = true
  let result = await reqArticleByTagId(pageNo.value, limit.value, sortParams.value, route.params.id)
  if (!result.tagName) {
      ElMessage.info(result.message)
      router.push('/404')
      return
    }
  tagName.value = result.tagName
  setTimeout(() => {
    resultList.value = result.data
    total.value = result.total
    loading.value = false
  }, 400)
}
const setSortParams = (value) => {
  if (sortParams.value == value) return
  sortParams.value = value
  pageNo.value = 1
  getData()
}
onMounted(() => {
  getData()
})
</script>

<style lang="less" scoped>
.tag_info {
  padding: 48px 0 34px;
  background-color: #f2f3f5;
  width: 100%;
  position: absolute;
  left: 0;
  top: 60px;
  text-align: center;
  color: #666666;

  h2 {
    font-size: 28px;
    line-height: 30px;
    font-weight: 700;
  }

  .tag_meta {
    margin-top: 5px;
    font-size: 12px;
  }
}

.container {
  width: 1000px;
  margin: 0 auto;
  margin-top: 121px;
  background: var(--background-color);

  .sort {
    display: flex;
    height: 46px;
    line-height: 46px;
    border-bottom: 1px solid rgba(228, 230, 235, 0.5);

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