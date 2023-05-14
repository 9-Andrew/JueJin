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
        <ul class="action_list">
          <li>
            <router-link to="">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-yanjing"></use>
              </svg>
              {{ article.view_num }}</router-link
            >
          </li>
          <li>
            <router-link to="">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-dianzan"></use>
              </svg>
              {{ article.like_num }}</router-link
            >
          </li>
          <li>
            <router-link to="">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-pinglun"></use>
              </svg>
              123</router-link
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
    display: flex;
    border-bottom: 1px solid rgba(228, 230, 235, 0.5);
    padding-bottom: 10px;
    .content_main {
      display: flex;
      flex-flow: column;
      justify-content: space-around;
      .title {
        font-weight: bolder;
        font-size: 17px;
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
            color: #1e80ff;
          }
        }
      }
    }
    .cover {
      flex-shrink: 0;
      width:120px;
      margin-left: 60px;
      .el-image {
        border-radius: 3px;
      }
    }
  }
}
</style>
