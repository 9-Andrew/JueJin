z<template>
  <div class="item" @click="router.push(`/article_detail/${article.id}`)">
    <div class="meta_container">
      <a @click.stop="router.push(`/user/${article.user_id}`)">{{
        article.nickname || article.username
      }}</a>
      <el-divider direction="vertical"></el-divider>
      <div class="date">{{ proxy.$moment(article.create_time).fromNow() }}</div>
      <el-divider direction="vertical" v-show="tags.length > 0"></el-divider>
      <a
        v-for="t in tags"
        :key="t.tag_id"
        @click.stop="router.push(`/tag/${t.tag_id}`)"
        class="tag"
        >{{ t.tag_name }}</a
      >
    </div>
    <div class="content_container">
      <div class="content_main">
        <div class="title">{{ article.title }}</div>
        <div class="article_content">{{ article.content }}</div>
        <ul class="action_list">
          <li>
            <a @click.stop="">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-yanjing"></use>
              </svg>
              {{ article.view_num }}</a
            >
          </li>
          <li>
            <a @click.stop="">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-dianzan"></use>
              </svg>
              {{ article.like_num }}</a
            >
          </li>
          <li>
            <a @click.stop="">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-pinglun"></use>
              </svg>
              0</a
            >
          </li>
        </ul>
      </div>
      <div class="cover">
        <el-image src="http://localhost:3000/images/default.png"></el-image>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, getCurrentInstance } from 'vue'
import { getArticleTags } from '@/api/article.js'
import { useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()
let props = defineProps(['article'])
let router = useRouter()
let tags = reactive([])

onMounted(async () => {
  const result = await getArticleTags(props.article.id)
  result.data && tags.push(...result.data)
})
</script>

<style lang="less" scoped>
a {
  color: #8a919f;
  &:hover {
    color: var(--theme-color);
  }
}
.item {
  padding: 12px 40px 0;
  cursor: pointer;
  background-color: #fff;

  &:hover {
    background: #fafafa;
  }
  .meta_container {
    display: flex;
    align-items: center;
    font-size: 14px;

    .user_message {
      color: #515767;
      &:hover {
        color: var(--theme-color);
      }
    }
    .date {
      color: #8a919f;
    }
    .tag {
      padding: 0 6px;
      position: relative;
      &:not(:last-of-type)::after {
        position: absolute;
        right: -1px;
        top: 50%;
        transform: translateY(-50%);
        display: block;
        content: ' ';
        width: 2px;
        height: 2px;
        border-radius: 50%;
        background: #8a919f;
      }
    }
  }
  .content_container {
    display: flex;
    border-bottom: 1px solid rgba(228, 230, 235, 0.5);
    padding-bottom: 10px;
    .content_main {
      display: flex;
      flex-flow: column;
      justify-content: space-around;
      .title {
        font-weight: bolder;
        font-size: 16px;
        padding: 5px 0;
      }
      .article_content {
        overflow: hidden;
        text-overflow: ellipsis;
        color: #8a919f;
        font-size: 13px;
        line-height: 2.7;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
      .action_list {
        display: flex;
        padding: 0;
        font-size: 13px;
        a {
          padding-right: 20px;
          &:hover {
            color: var(--theme-color);
          }
        }
      }
    }
    .cover {
      flex-shrink: 0;
      width: 120px;
      margin-left: 60px;
      .el-image {
        border-radius: 3px;
      }
    }
  }
}
</style>
