<template>
  <div class="item" @click="openArticleDetail">
    <div class="meta_container">
      <a @click.stop="router.push(`/user/${article.user_id}`)">{{
        article.nickname || article.username
      }}</a>
      <el-divider direction="vertical"></el-divider>
      <div class="date">{{ proxy.$moment(article.create_time).fromNow() }}</div>
      <el-divider direction="vertical" v-show="tags.length > 0"></el-divider>
      <a v-for="t in tags" :key="t.tag_id" @click.stop="router.push(`/tag/${t.tag_id}`)" class="tag">{{ t.tag_name }}</a>
    </div>
    <div class="content_container">
      <div class="content_main">
        <div class="title" v-html="keyWords ? highLight(article.title) : parseText(article.title)"></div>
        <div class="article_content" v-html="keyWords ? highLight(article.content) : parseText(article.content)">
        </div>
        <ul class="action_list">
          <li>
            <a @click.stop="">
              <SvgIcon name="yanjing"></SvgIcon>
              {{ article.view_num }}
            </a>
          </li>
          <li>
            <a @click.stop="">
              <SvgIcon name="dianzan"></SvgIcon>
              {{ article.like_num }}
            </a>
          </li>
          <li>
            <a @click.stop="">
              <SvgIcon name="pinglun"></SvgIcon>
              0
            </a>
          </li>
        </ul>
      </div>
      <div v-if="article.cover" class="cover">
        <el-image :src="`${BASEURL}/${article.cover}`" fit="contain" :lazy="true"></el-image>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, getCurrentInstance, computed } from 'vue'
import { getArticleTags } from '@/api/article.js'
import { useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'

const { proxy } = getCurrentInstance()
let props = defineProps(['article', 'keyWords'])
let router = useRouter()
let tags = reactive([])

const parseText = (original) => {
  // 将 Markdown 文本转换为纯文本内容，去除其中的所有 HTML 标签，只保留纯文本部分
  return new MarkdownIt().render(original).replace(/<[^>]+>/g, '')
}
const highLight = (text) => {
  let reg = new RegExp(props.keyWords, "gi")
  return parseText(text).replace(reg, `<span style='color:red;font-weight:bolder;'>${props.keyWords}</span>`)
}
const openArticleDetail = () => {
  const url = router.resolve(`/detail/${props.article.id}`).href
  window.open(url, '_blank')
}
const BASEURL = computed(() => import.meta.env.VITE_APP_BASEURL)

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
    max-height: 100px;

    .content_main {
      display: flex;
      flex-flow: column;
      justify-content: space-around;
      flex-grow: 1;

      .title {
        font-weight: bolder;
        font-size: 16px;
        padding-top: 5px;
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
      width: 140px;
      margin-left: 60px;

      .el-image {
        border-radius: 3px;
        height: 100%;
      }
    }
  }
}
</style>
