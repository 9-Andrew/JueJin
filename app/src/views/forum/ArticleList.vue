<template>
  <div class="item">
    <div class="meta_container">
      <router-link class="user_message" to="">{{
        article.nickname || article.username
      }}</router-link>
      <el-divider direction="vertical"></el-divider>
      <div class="date">{{ moment(article.create_time).fromNow() }}</div>
      <el-divider direction="vertical"></el-divider>
      <router-link class="tag" to="">{{ article.article_type }}</router-link>
    </div>
    <div class="content_container">
      <div class="content_main">
        <div class="title">{{ article.title }}</div>
        <div class="article_content">{{ article.content }}</div>
      </div>
      <div class="cover"></div>
    </div>
  </div>
</template>

<script setup>
defineProps(['article', 'moment'])
</script>

<style lang="less" scoped>
a {
  color: #8a919f;
  &:hover {
    color: #1e80ff;
  }
}
.item {
  padding: 12px 40px 0;

  &:hover {
    background: #fafafa;
  }
  .meta_container {
    display: flex;
    align-items: center;

    .user_message {
      color: #515767;
      &:hover {
        color: #1e80ff;
      }
    }
    .date {
      color: #8a919f;
    }
  }
  .content_container {
    border-bottom: 1px solid rgba(228, 230, 235, 0.5);
    .content_main {
      .title {
        font-weight: bolder;
        font-size: 17px;
        padding: 5px 0;
      }
      .article_content {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #8a919f;
        font-size: 13px;
        line-height: 2.7;
      }
    }
  }
}
</style>
